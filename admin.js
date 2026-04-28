export default async function (req, reply) {
  try {
    // 🔐 vérifier utilisateur authentifié
    if (!req.user) {
      return reply.code(401).send({ error: "Non authentifié" });
    }

    // 🔐 vérifier rôle admin
    if (req.user.role !== "admin") {
      return reply.code(403).send({ error: "Accès refusé" });
    }

  } catch (err) {
    console.error("Admin middleware error:", err);
    return reply.code(500).send({ error: "Erreur serveur" });
  }
}

// ================= SECURITE ADMIN (demo simple) =================
const user = JSON.parse(localStorage.getItem("user"));

if(!user){
    localStorage.setItem("user", JSON.stringify({ role:"admin", email:"admin@piblay.com" }));
}

// ================= NAVIGATION =================
document.querySelectorAll(".nav-item").forEach(item=>{
    item.addEventListener("click", ()=>{

        document.querySelectorAll(".nav-item").forEach(i=>i.classList.remove("active"));
        item.classList.add("active");

        const tab = item.dataset.tab;

        if(!tab) return;

        document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
        document.getElementById(tab).classList.add("active");

    });
});

// ================= DATA DEMO =================
function loadAdmin(){

    const data = {
        stats: { alerts: 2 },
        users: [
            { email:"user1@mail.com", role:"user", blocked:false },
            { email:"baduser@mail.com", role:"user", blocked:true }
        ],
        logs: [
            { type:"LOGIN", email:"user1@mail.com", date:Date.now() },
            { type:"FAILED", email:"baduser@mail.com", date:Date.now() }
        ]
    };

    document.getElementById("totalUsers").innerText = data.users.length;
    document.getElementById("alerts").innerText = data.stats.alerts;

    // USERS
    const usersList = document.getElementById("usersList");
    usersList.innerHTML = "";

    data.users.forEach(u=>{
        usersList.innerHTML += `
            <div class="card">
                <p>${u.email}</p>
                <p>Role: ${u.role}</p>
                <button onclick="blockUser('${u.email}')">
                    ${u.blocked ? "Débloquer" : "Bloquer"}
                </button>
            </div>
        `;
    });

    // LOGS
    const logsList = document.getElementById("logsList");
    logsList.innerHTML = "";

    data.logs.reverse().forEach(l=>{
        logsList.innerHTML += `
            <div class="card">
                <p>${l.type} | ${l.email}</p>
                <small>${new Date(l.date).toLocaleString()}</small>
            </div>
        `;
    });
}

loadAdmin();

// ================= ACTIONS =================
function blockUser(email){
    alert("Simulation blocage: " + email);
}

function logout(){
    localStorage.removeItem("user");
    window.location.href = "./login.html";
}

function toggleMaintenance(){
    alert("Mode maintenance (nécessite backend)");
}
