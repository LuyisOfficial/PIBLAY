let activeChatAgencyEmail = null;
const clientData = JSON.parse(localStorage.getItem('piblay_user'));

// ================= INIT =================
function init() {

    // 🔐 Vérification connexion
    if (!clientData) {
        window.location.href = "login.html";
        return;
    }

    // 🔐 Vérification rôle
    if (clientData.role !== "client") {
        alert("Accès réservé aux clients");
        window.location.href = "login.html";
        return;
    }

    // 🔐 Vérification abonnement
    if (clientData.isPaid !== true) {
        document.getElementById('lock-overlay').style.display = 'flex';
        return;
    }

    loadAgencies();
}

// ================= LOAD AGENCIES =================
function loadAgencies() {

    const allUsers = JSON.parse(localStorage.getItem('all_piblay_users')) || [];
    const grid = document.getElementById('agenciesGrid');

    const activeAgencies = allUsers.filter(u => 
        u.role === 'agency' && 
        u.isPaid === true
    );

    if(activeAgencies.length === 0){
        grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px;">
            <p>Aucune agence disponible</p>
        </div>`;
        return;
    }

    grid.innerHTML = activeAgencies.map(agency => {

        // 🔐 Protection XSS
        const name = escapeHTML(agency.fullname || "Agence Certifiée");
        const bio = escapeHTML(agency.bio || "Expert publicité digitale");

        return `
        <div class="card">
            <img src="${agency.avatar || 'https://via.placeholder.com/90'}">
            <h3>${name}</h3>
            <p class="bio">${bio}</p>

            <div class="social-icons">
                ${agency.socials?.facebook ? `<a href="${agency.socials.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>` : ''}
                ${agency.socials?.instagram ? `<a href="${agency.socials.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                ${agency.socials?.tiktok ? `<a href="${agency.socials.tiktok}" target="_blank"><i class="fab fa-tiktok"></i></a>` : ''}
            </div>

            <button class="btn-contact" onclick="openChat('${agency.email}', '${name}')">
                💬 Contacter
            </button>
        </div>
        `;
    }).join('');
}

// ================= CHAT =================
function openChat(email, name){
    activeChatAgencyEmail = email;

    document.getElementById('chat-with').innerText = name;
    document.getElementById('chat-container').style.display = 'flex';

    renderMessages();
}

// ================= SEND MESSAGE =================
function sendMessage(){
    const input = document.getElementById('chat-input-field');
    const text = input.value.trim();

    if(!text || !activeChatAgencyEmail) return;

    let messages = JSON.parse(localStorage.getItem('piblay_chats')) || [];

    const newMsg = {
        id: Date.now(),
        from: clientData.email,
        to: activeChatAgencyEmail,
        text: escapeHTML(text),
        time: new Date().toISOString()
    };

    messages.push(newMsg);
    localStorage.setItem('piblay_chats', JSON.stringify(messages));

    input.value = "";
    renderMessages();
}

// ================= RENDER =================
function renderMessages(){

    if(!activeChatAgencyEmail) return;

    const container = document.getElementById('chat-messages');
    let messages = JSON.parse(localStorage.getItem('piblay_chats')) || [];

    const conversation = messages.filter(m =>
        (m.from === clientData.email && m.to === activeChatAgencyEmail) ||
        (m.from === activeChatAgencyEmail && m.to === clientData.email)
    );

    container.innerHTML = conversation.map(m => `
        <div class="msg ${m.from === clientData.email ? 'sent' : 'received'}">
            ${m.text}
        </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
}

// ================= CLOSE CHAT =================
function closeChat(){
    document.getElementById('chat-container').style.display = 'none';
    activeChatAgencyEmail = null;
}

// ================= SECURITY =================
function escapeHTML(str){
    return str.replace(/[&<>"']/g, function(tag) {
        const chars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return chars[tag] || tag;
    });
}

// ================= EVENTS =================
document.addEventListener("DOMContentLoaded", () => {

    init();

    document.getElementById('close-chat-btn')?.addEventListener('click', closeChat);
    document.getElementById('send-msg-btn')?.addEventListener('click', sendMessage);

    document.getElementById('chat-input-field')?.addEventListener('keypress', (e)=>{
        if(e.key === "Enter") sendMessage();
    });

    // 🔁 Auto refresh chat (simulation temps réel)
    setInterval(renderMessages, 3000);
});