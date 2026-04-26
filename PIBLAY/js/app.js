import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { db } from "../server/db.js";

import authRoutes from "../server/routes/auth.js";
import userRoutes from "../server/routes/user.js";
import campaignRoutes from "../server/routes/campaign.js";
import trackingRoutes from "../server/routes/tracking.js";
import adminRoutes from "../server/routes/admin.js";

app.register(adminRoutes, { db });
app.register(campaignRoutes, { db });
app.register(trackingRoutes, { db, io });

const app = Fastify();

app.register(cors, {
  origin: true,
  credentials: true
});

app.register(cookie);

app.register(jwt, {
  secret: "SUPER_SECRET_KEY_CHANGE_ME"
});

// middleware auth
app.decorate("authenticate", async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.code(401).send("Unauthorized");
  }
});

app.register(authRoutes, { db });
app.register(userRoutes, { db });

app.listen({ port: 3000 }, () => {
  console.log("Server running on http://localhost:3000");
});



async function loadAdmin(){

    const usersRes = await fetch("http://localhost:3000/admin/users", {
        credentials:"include"
    });

    const users = await usersRes.json();

    let html = "";

    users.forEach(u=>{
        html += `
        <div class="card">
            ${u.name} (${u.role}) - ${u.active ? "Actif" : "Bloqué"}
            <button onclick="deleteUser('${u.id}')">Supprimer</button>
            <button onclick="toggleUser('${u.id}')">Activer/Désactiver</button>
        </div>`;
    });

    document.getElementById("users").innerHTML = html;


    // CAMPAIGNS
    const campRes = await fetch("http://localhost:3000/admin/campaigns", {
        credentials:"include"
    });

    const campaigns = await campRes.json();

    let chtml = "";

    campaigns.forEach(c=>{
        chtml += `
        <div class="card">
            ${c.name} - Client: ${c.client_id}
        </div>`;
    });

    document.getElementById("campaigns").innerHTML = chtml;
}

async function deleteUser(id){
    await fetch(`http://localhost:3000/admin/user/${id}`, {
        method:"DELETE",
        credentials:"include"
    });

    loadAdmin();
}

async function toggleUser(id){
    await fetch(`http://localhost:3000/admin/user/${id}/toggle`, {
        method:"PUT",
        credentials:"include"
    });

    loadAdmin();
}

// CONFIGURATION PARTICLES.JS
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 100 },
        "color": { "value": "#FFD700" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5 },
        "size": { "value": 2 },
        "line_linked": { 
            "enable": true, 
            "distance": 150, 
            "color": "#FFD700", 
            "opacity": 0.3, 
            "width": 1 
        },
        "move": { "enable": true, "speed": 2 }
    },
    "interactivity": { 
        "events": { 
            "onhover": { "enable": true, "mode": "grab" } 
        } 
    }
});

// TRANSITION ÉCRAN D'ENTRÉE -> PAGE PRINCIPALE
window.addEventListener('load', () => {
    // On attend 4 secondes (temps de l'intro) avant de lancer la transition
    setTimeout(() => {
        const entry = document.getElementById('entry-screen');
        const main = document.getElementById('main-page');

        // Fondu de l'écran d'entrée
        entry.style.opacity = '0';
        
        setTimeout(() => {
            entry.style.display = 'none';
            main.style.display = 'flex';
            // Petit délai pour déclencher le fondu entrant de la page principale
            setTimeout(() => { main.style.opacity = '1'; }, 50);
        }, 1200); // Correspond à la durée de transition CSS
    }, 4000); 
});

// GESTION DU BOUTON START ET DU MENU D'OPTIONS
const startBtn = document.getElementById('start-button');
const optionsCont = document.getElementById('options-container');

startBtn.addEventListener('click', () => {
    optionsCont.style.display = 'flex';
});

// Fonction pour fermer le menu d'options
function closeOptions() {
    optionsCont.style.display = 'none';
}

   /**
 * Gère l'affichage du menu d'aide Piblay
 */
function toggleChat() {
    const chatMenu = document.getElementById('chatMenu');
    
    // Alterne la classe 'active'
    chatMenu.classList.toggle('active');
}

// Fermer le menu si on clique en dehors du menu ou du bouton
document.addEventListener('click', function(event) {
    const chatMenu = document.getElementById('chatMenu');
    const chatBtn = document.querySelector('.chat-floating');

    // Si le menu est ouvert ET que le clic n'est ni sur le menu ni sur le bouton
    if (chatMenu.classList.contains('active')) {
        if (!chatMenu.contains(event.target) && !chatBtn.contains(event.target)) {
            chatMenu.classList.remove('active');
        }
    }
});


// Enregistrement du Service Worker pour PIBLAY
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js') // Assurez-vous que le fichier SW est à la racine
      .then(registration => {
        console.log('PIBLAY : Service Worker enregistré avec succès ! Portée :', registration.scope);
      })
      .catch(error => {
        console.log('PIBLAY : Échec de l\'enregistrement du Service Worker :', error);
      });
  });
}

