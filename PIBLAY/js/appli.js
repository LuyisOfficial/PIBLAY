const ADMIN_EMAILS = [
    "juntanluyis@gmail.com",
    "jonathanlouis349@gmail.com",
    "info.piblay@gmail.com"
];

const ADMIN_SECRET = "@JL160802";

// NAVIGATION
function goLogin(){ window.location="login.html"; }
function goRegister(){ window.location="register.html"; }

// REGISTER
function register(){
    let user = {
        id: "PB-" + Math.floor(Math.random()*100000),
        type: document.getElementById("type").value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        active:false,
        clicks:0,
        impressions:0
    };

    localStorage.setItem(user.email, JSON.stringify(user));
    alert("Compte créé ID: "+user.id);
    window.location="login.html";
}

// LOGIN
function login(){
    let email = document.getElementById("email").value;
    let user = JSON.parse(localStorage.getItem(email));

    if(!user) return alert("Compte introuvable");

    if(ADMIN_EMAILS.includes(email)){
        let code = prompt("Code admin:");
        if(code===ADMIN_SECRET) return window.location="admin.html";
    }

    localStorage.setItem("currentUser", email);

    if(user.type==="client") window.location="client-dashboard.html";
    else window.location="agency-dashboard.html";
}

// CLIENT ACTIVATE
function activate(){
    let email = localStorage.getItem("currentUser");
    let user = JSON.parse(localStorage.getItem(email));

    user.active=true;
    localStorage.setItem(email, JSON.stringify(user));

    alert("Compte activé");
}

// CREATE CAMPAIGN
function createCampaign(){
    alert("Campagne créée (simulation)");
}

// ADMIN
function clearAll(){
    localStorage.clear();
    alert("Tout supprimé");
}

// LOGOUT
function logout(){
    localStorage.removeItem("currentUser");
    window.location="index.html";
}




function initPayPal(plan, type){

    let email = localStorage.getItem("currentUser");
    let user = JSON.parse(localStorage.getItem(email));

    paypal.Buttons({

        createOrder: async () => {

            const res = await fetch("http://localhost:3000/paypal/create-order", {
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

            await fetch("http://localhost:3000/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderID: data.orderID,
                    userId: user.id
                })
            });

            alert("Paiement réussi !");
            window.location = "client-dashboard.html";
        }

    }).render("#paypal-button-container");
}
