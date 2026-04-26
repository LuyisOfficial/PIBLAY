document.addEventListener('DOMContentLoaded', () => {

    const currentUser = JSON.parse(localStorage.getItem('piblay_user'));

    if (!currentUser) {
        alert("Connexion requise");
        window.location.href = "login.html";
        return;
    }

    renderMembers();
    loadMessages();

    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendMessage();
        });
    }
});

// ================= MEMBERS =================
function renderMembers() {

    const currentUser = JSON.parse(localStorage.getItem('piblay_user'));
    const allUsers = JSON.parse(localStorage.getItem('all_piblay_users')) || [];
    const container = document.getElementById('members-list');

    if (!container) return;

    container.innerHTML = "";

    allUsers.forEach((user, index) => {

        if (user.role === 'admin' || user.isPaid) {

            let badgeClass = "";
            let badgeText = "";

            if (user.role === 'admin') {
                badgeClass = "badge-admin";
                badgeText = "ADMIN";
            } else if (user.role === 'agency') {
                badgeClass = "badge-agency";
                badgeText = "AGENCE";
            } else {
                badgeClass = "badge-owner";
                badgeText = "PROPRIÉTAIRE";
            }

            const div = document.createElement("div");
            div.className = "member-card";

            div.innerHTML = `
                <div class="member-info">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=' + user.email}" class="member-avatar">
                    <div>
                        <strong>${user.email}</strong><br>
                        <span class="badge ${badgeClass}">${badgeText}</span>
                    </div>
                </div>
                ${currentUser.role === 'admin' ? `
                    <div class="admin-controls">
                        <button class="btn-kick" data-index="${index}">Expulser</button>
                    </div>
                ` : ''}
            `;

            container.appendChild(div);
        }
    });

    // 🔥 Gestion boutons admin
    document.querySelectorAll('.btn-kick').forEach(btn => {
        btn.addEventListener('click', () => {
            kickMember(btn.dataset.index);
        });
    });
}

// ================= KICK MEMBER =================
function kickMember(index) {

    const allUsers = JSON.parse(localStorage.getItem('all_piblay_users')) || [];

    if (!allUsers[index]) return;

    if (confirm("Révoquer l'accès de ce membre ?")) {

        allUsers[index].isPaid = false;

        localStorage.setItem('all_piblay_users', JSON.stringify(allUsers));

        renderMembers();

        alert("Accès supprimé.");
    }
}

// ================= SEND MESSAGE =================
function sendMessage() {

    const input = document.getElementById('chat-input');
    const user = JSON.parse(localStorage.getItem('piblay_user'));

    if (!input || !user) return;

    if (input.value.trim() === "") return;

    const newMessage = {
        sender: user.email,
        role: user.role,
        text: input.value,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: Date.now()
    };

    const messages = JSON.parse(localStorage.getItem('piblay_group_chat')) || [];

    messages.push(newMessage);

    localStorage.setItem('piblay_group_chat', JSON.stringify(messages));

    input.value = "";

    loadMessages();
}

// ================= LOAD MESSAGES =================
function loadMessages() {

    const container = document.getElementById('chat-messages');
    const messages = JSON.parse(localStorage.getItem('piblay_group_chat')) || [];
    const currentUser = JSON.parse(localStorage.getItem('piblay_user'));

    if (!container || !currentUser) return;

    container.innerHTML = "";

    messages.forEach((msg, index) => {

        const isMe = msg.sender === currentUser.email;

        let badgeColor =
            msg.role === 'admin' ? '#FFD700' :
            msg.role === 'agency' ? '#10b981' :
            '#3b82f6';

        const div = document.createElement("div");
        div.className = `msg ${isMe ? 'me' : msg.role}`;

        div.innerHTML = `
            <div class="msg-info">
                <span style="color:${badgeColor}; font-weight:bold;">
                    ${msg.sender.split('@')[0]}
                </span>
                <span style="opacity:0.5; font-size:0.6rem;">
                    ${msg.time}
                </span>
                ${currentUser.role === 'admin' ? `
                    <span class="delete-btn" data-index="${index}" style="color:#ef4444; cursor:pointer;">🗑</span>
                ` : ''}
            </div>
            <div class="msg-text">${msg.text}</div>
        `;

        container.appendChild(div);
    });

    // 🔥 delete message (admin)
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            deleteMessage(btn.dataset.index);
        });
    });

    container.scrollTop = container.scrollHeight;
}

// ================= DELETE MESSAGE =================
function deleteMessage(index) {

    let messages = JSON.parse(localStorage.getItem('piblay_group_chat')) || [];

    if (!messages[index]) return;

    if (confirm("Supprimer ce message ?")) {

        messages.splice(index, 1);

        localStorage.setItem('piblay_group_chat', JSON.stringify(messages));

        loadMessages();
    }
}
