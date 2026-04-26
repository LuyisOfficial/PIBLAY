let activeChatAgencyEmail = null;
let clientData = null;

// ================= INIT =================
function init() {

    // 🔐 récupérer user dynamiquement
    try {
        clientData = JSON.parse(localStorage.getItem('piblay_user'));
    } catch {
        clientData = null;
    }

    // 🔐 Vérification connexion
    if (!clientData) {
        window.location.href = "./login.html";
        return;
    }

    // 🔐 Vérification rôle
    if (clientData.role !== "client") {
        alert("Accès réservé aux clients");
        window.location.href = "./login.html";
        return;
    }

    // 🔐 Vérification abonnement
    if (clientData.isPaid !== true) {
        const lock = document.getElementById('lock-overlay');
        if (lock) lock.style.display = 'flex';
        return;
    }

    loadAgencies();
}

// ================= LOAD AGENCIES =================
function loadAgencies() {

    const allUsers = JSON.parse(localStorage.getItem('all_piblay_users')) || [];
    const grid = document.getElementById('agenciesGrid');

    if (!grid) return;

    const activeAgencies = allUsers.filter(u =>
        u.role === 'agency' &&
        u.isPaid === true
    );

    if (activeAgencies.length === 0) {
        grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px;">
            <p>Aucune agence disponible</p>
        </div>`;
        return;
    }

    grid.innerHTML = activeAgencies.map(agency => {

        const name = escapeHTML(agency.fullname || "Agence Certifiée");
        const bio = escapeHTML(agency.bio || "Expert publicité digitale");

        return `
        <div class="card">
            <img src="${agency.avatar || 'https://via.placeholder.com/90'}" alt="avatar">
            <h3>${name}</h3>
            <p class="bio">${bio}</p>

            <div class="social-icons">
                ${agency.socials?.facebook ? `<a href="${agency.socials.facebook}" target="_blank" rel="noopener"><i class="fab fa-facebook"></i></a>` : ''}
                ${agency.socials?.instagram ? `<a href="${agency.socials.instagram}" target="_blank" rel="noopener"><i class="fab fa-instagram"></i></a>` : ''}
                ${agency.socials?.tiktok ? `<a href="${agency.socials.tiktok}" target="_blank" rel="noopener"><i class="fab fa-tiktok"></i></a>` : ''}
            </div>

            <button class="btn-contact" data-email="${agency.email}" data-name="${name}">
                💬 Contacter
            </button>
        </div>
        `;
    }).join('');

    // 🔥 Event delegation (plus propre que onclick inline)
    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-contact');
        if (!btn) return;

        openChat(btn.dataset.email, btn.dataset.name);
    });
}

// ================= CHAT =================
function openChat(email, name) {

    if (!email) return;

    activeChatAgencyEmail = email;

    const title = document.getElementById('chat-with');
    const container = document.getElementById('chat-container');

    if (title) title.innerText = name;
    if (container) container.style.display = 'flex';

    renderMessages();
}

// ================= SEND MESSAGE =================
function sendMessage() {

    const input = document.getElementById('chat-input-field');
    if (!input) return;

    const text = input.value.trim();

    if (!text || !activeChatAgencyEmail) return;

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
function renderMessages() {

    if (!activeChatAgencyEmail) return;

    const container = document.getElementById('chat-messages');
    if (!container) return;

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
function closeChat() {
    const container = document.getElementById('chat-container');
    if (container) container.style.display = 'none';

    activeChatAgencyEmail = null;
}

// ================= SECURITY =================
function escapeHTML(str = "") {
    return str.replace(/[&<>"']/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[tag]));
}

// ================= EVENTS =================
document.addEventListener("DOMContentLoaded", () => {

    init();

    document.getElementById('close-chat-btn')?.addEventListener('click', closeChat);
    document.getElementById('send-msg-btn')?.addEventListener('click', sendMessage);

    document.getElementById('chat-input-field')?.addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    // 🔁 Simulation temps réel
    setInterval(() => {
        if (activeChatAgencyEmail) renderMessages();
    }, 3000);
});
