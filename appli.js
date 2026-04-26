const ADMIN_EMAILS = [
    "juntanluyis@gmail.com",
    "jonathanlouis349@gmail.com",
    "info.piblay@gmail.com"
];

const ADMIN_SECRET = "@JL160802";

// ================= NAVIGATION =================
function goLogin(){ window.location.href = "login.html"; }
function goRegister(){ window.location.href = "register.html"; }

// ================= REGISTER =================
function register(){

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim().toLowerCase();
    const password = document.getElementById("password")?.value;
    const type = document.getElementById("type")?.value;

    if(!name || !email || !password){
        alert("Veuillez remplir tous les champs");
        return;
    }

    let users = JSON.parse(localStorage.getItem("piblay_users")) || [];

    if(users.find(u => u.email === email)){
        alert("Email déjà utilisé");
        return;
    }

    const user = {
        id: "PB-" + Date.now(),
        type,
        name,
        email,
        password,
        active: false,
        clicks: 0,
        impressions: 0
    };

    users.push(user);
    localStorage.setItem("piblay_users", JSON.stringify(users));

    alert("Compte créé !");
    window.location.href = "login.html";
}

// ================= LOGIN =================
function login(){

    const email = document.getElementById("email")?.value.trim().toLowerCase();
    const password = document.getElementById("password")?.value;

    let users = JSON.parse(localStorage.getItem("piblay_users")) || [];

    let user = users.find(u => u.email === email && u.password === password);

    if(!user){
        alert("Identifiants incorrects");
        return;
    }

    // 🔐 ADMIN CHECK
    if(ADMIN_EMAILS.includes(email)){
        const code = prompt("Code admin :");
        if(code === ADMIN_SECRET){
            localStorage.setItem("currentUser", JSON.stringify(user));
            window.location.href = "admin.html";
            return;
        }
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    if(user.type === "client"){
        window.location.href = "client-dashboard.html";
    } else {
        window.location.href = "agency-dashboard.html";
    }
}

// ================= ACTIVATE =================
function activate(){

    let user = JSON.parse(localStorage.getItem("currentUser"));
    if(!user) return;

    user.active = true;

    let users = JSON.parse(localStorage.getItem("piblay_users")) || [];

    users = users.map(u => u.email === user.email ? user : u);

    localStorage.setItem("piblay_users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Compte activé");
}

// ================= CREATE CAMPAIGN =================
function createCampaign(){
    alert("Campagne créée (simulation)");
}

// ================= ADMIN =================
function clearAll(){
    if(confirm("Supprimer toutes les données ?")){
        localStorage.clear();
        alert("Tout supprimé");
    }
}

// ================= LOGOUT =================
function logout(){
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// ================= PAYPAL =================
function initPayPal(plan, type){

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if(!user){
        alert("Connexion requise");
        return;
    }

    if(typeof paypal === "undefined"){
        console.error("PayPal SDK non chargé");
        return;
    }

    paypal.Buttons({

        createOrder: async () => {

            // ⚠️ IMPORTANT: remplace localhost par ton backend en ligne
            const res = await fetch("https://ton-backend.com/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan,
                    type,
                    userId: user.id
                })
            });

            const data = await res.json();
            return data.id;
        },

        onApprove: async (data) => {

            await fetch("https://ton-backend.com/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderID: data.orderID,
                    userId: user.id
                })
            });

            alert("Paiement réussi !");
            window.location.href = "client-dashboard.html";
        },

        onError: (err) => {
            console.error(err);
            alert("Erreur paiement");
        }

    }).render("#paypal-button-container");
}
