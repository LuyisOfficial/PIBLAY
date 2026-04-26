require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// ================= CONFIG =================
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME_SECURE";
const BASE_URL = process.env.BASE_URL || "http://localhost:5500";

// 🔐 CORS sécurisé (change en prod)
app.use(cors({
    origin: "*"
}));

app.use(express.json());

// ================= DATA =================
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

// ================= UTILS =================
function track(type, email, req){
    logs.push({
        type,
        email,
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        date: Date.now()
    });
}

function canSendOTP(user){
    if(!user.lastOTP) return true;
    return Date.now() - user.lastOTP > 60000;
}

function isStrongPassword(password){
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[0-9]/.test(password);
}

// ================= REGISTER =================
app.post("/register", async (req,res)=>{
    try{
        const { email, password, role } = req.body;

        if(!email || !password){
            return res.status(400).json({ message:"Champs manquants" });
        }

        if(!isStrongPassword(password)){
            return res.status(400).json({
                message:"Mot de passe faible"
            });
        }

        if(users.find(u => u.email === email)){
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

    }catch(err){
        res.status(500).json({ message:"Erreur serveur" });
    }
});

// ================= LOGIN =================
app.post("/login", async (req,res)=>{
    try{
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

        res.json({ token, role: user.role });

    }catch{
        res.status(500).json({ message:"Erreur serveur" });
    }
});

// ================= FORGOT PASSWORD =================
app.post("/forgot-password", async (req,res)=>{
    try{
        const { email } = req.body;

        const user = users.find(u => u.email === email);

        if(!user){
            return res.json({ message:"Si cet email existe..." });
        }

        const token = crypto.randomBytes(32).toString("hex");

        user.resetToken = token;
        user.resetExpire = Date.now() + 3600000;

        const link = `${BASE_URL}/reset.html?token=${token}`;

        await transporter.sendMail({
            to: email,
            subject: "Reset PIBLAY",
            html: `<a href="${link}">${link}</a>`
        });

        res.json({ message:"Email envoyé" });

    }catch{
        res.status(500).json({ message:"Erreur serveur" });
    }
});

// ================= START =================
app.listen(PORT, ()=>{
    console.log(`🚀 Server running on port ${PORT}`);
});
