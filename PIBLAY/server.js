require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME_SECURE";
const BASE_URL = process.env.BASE_URL || "http://localhost:5500";

let users = [];
let logs = [];

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ================= TRACK =================
function track(type, email, req){
    logs.push({
        type,
        email,
        ip: req.ip,
        date: Date.now()
    });
}

// ================= RATE LIMIT OTP =================
function canSendOTP(user){
    if(!user.lastOTP) return true;
    return Date.now() - user.lastOTP > 60000;
}

// ================= VALIDATION PASSWORD =================
function isStrongPassword(password){
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[0-9]/.test(password);
}

// ================= REGISTER =================
app.post("/register", async (req,res)=>{
    const { email, password, role } = req.body;

    if(!email || !password){
        return res.status(400).json({ message:"Champs manquants" });
    }

    if(!isStrongPassword(password)){
        return res.status(400).json({
            message:"Mot de passe faible (8 caractères + 1 majuscule + 1 chiffre)"
        });
    }

    const exists = users.find(u => u.email === email);
    if(exists){
        return res.status(400).json({ message:"Email déjà utilisé" });
    }

    const hashed = await bcrypt.hash(password, 12);

    users.push({
        email,
        password: hashed,
        role,
        blocked:false
    });

    res.json({ success:true });
});

// ================= FORGOT PASSWORD =================
app.post("/forgot-password", async (req,res)=>{
    const { email } = req.body;

    const user = users.find(u => u.email === email);

    // 🔐 réponse neutre anti-hacker
    if(!user){
        return res.json({ message:"Si cet email existe, un lien a été envoyé." });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetExpire = Date.now() + 3600000;

    const link = `${BASE_URL}/reset.html?token=${token}`;

    await transporter.sendMail({
        to: email,
        subject: "Réinitialisation PIBLAY",
        html: `
        <h3>Reset Password</h3>
        <p>Clique sur ce lien :</p>
        <a href="${link}">${link}</a>
        <p>Expire dans 1 heure</p>
        `
    });

    res.json({ message:"Email envoyé" });
});

// ================= RESET PASSWORD =================
app.post("/reset-password", async (req,res)=>{
    const { token, password } = req.body;

    const user = users.find(u =>
        u.resetToken === token &&
        u.resetExpire > Date.now()
    );

    if(!user){
        return res.status(400).json({ message:"Token invalide" });
    }

    if(!isStrongPassword(password)){
        return res.status(400).json({ message:"Mot de passe trop faible" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = null;

    res.json({ message:"Mot de passe changé" });
});

// ================= SEND OTP =================
app.post("/send-otp", async (req,res)=>{
    const { email } = req.body;

    const user = users.find(u => u.email === email);

    if(!user){
        return res.json({ message:"Si cet email existe, un code a été envoyé." });
    }

    if(!canSendOTP(user)){
        return res.json({ message:"Attends 1 minute" });
    }

    const otp = Math.floor(100000 + Math.random()*900000).toString();

    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpire = Date.now() + 5*60*1000;
    user.lastOTP = Date.now();

    await transporter.sendMail({
        to: email,
        subject: "Code OTP PIBLAY",
        html: `<h2>${otp}</h2><p>Expire dans 5 minutes</p>`
    });

    track("OTP_SENT", email, req);

    res.json({ message:"OTP envoyé" });
});

// ================= VERIFY OTP =================
app.post("/verify-otp", async (req,res)=>{
    const { email, code } = req.body;

    const user = users.find(u => u.email === email);

    if(!user || !user.otp){
        return res.json({ success:false });
    }

    const valid = await bcrypt.compare(code, user.otp);

    if(!valid || user.otpExpire < Date.now()){
        track("FAILED", email, req);

        // 🔴 DETECTION BRUTE FORCE
        const fails = logs.filter(l =>
            l.ip === req.ip && l.type==="FAILED"
        ).length;

        if(fails > 5){
            user.blocked = true;
        }

        return res.json({ success:false });
    }

    const token = jwt.sign(
        { email },
        JWT_SECRET,
        { expiresIn:"10m" }
    );

    res.json({ success:true, token });
});

// ================= RESET VIA OTP =================
app.post("/reset-password-otp", async (req,res)=>{
    const { token, password } = req.body;

    try{
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = users.find(u => u.email === decoded.email);

        if(!user){
            return res.status(400).json({ message:"User not found" });
        }

        user.password = await bcrypt.hash(password, 12);
        user.otp = null;

        res.json({ success:true });

    }catch{
        res.status(400).json({ message:"Token invalide" });
    }
});

// ================= LOGIN =================
app.post("/login", async (req,res)=>{
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);

    if(!user){
        track("FAILED", email, req);
        return res.status(400).json({ message:"Erreur login" });
    }

    if(user.blocked){
        return res.status(403).json({ message:"Compte bloqué" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if(!valid){
        track("FAILED", email, req);
        return res.status(400).json({ message:"Erreur login" });
    }

    track("LOGIN", email, req);

    const token = jwt.sign(
        { email },
        JWT_SECRET,
        { expiresIn:"2h" }
    );

    res.json({ message:"Connexion réussie", token });
});

// ================= ADMIN =================
app.get("/admin/security", (req,res)=>{
    res.json({
        stats:{
            logins: logs.filter(l=>l.type==="LOGIN").length,
            otp: logs.filter(l=>l.type==="OTP_SENT").length,
            alerts: logs.filter(l=>l.type==="FAILED").length
        },
        users,
        logs
    });
});

app.post("/admin/block", (req,res)=>{
    const { email } = req.body;

    const user = users.find(u => u.email === email);

    if(user){
        user.blocked = !user.blocked;
    }

    res.json({ success:true });
});

// ================= START =================
app.listen(3000, ()=>console.log("🚀 PIBLAY Secure Server Running"));