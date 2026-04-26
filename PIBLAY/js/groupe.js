document.addEventListener('DOMContentLoaded', () => {
    renderMembers();
});

function renderMembers() {
    const currentUser = JSON.parse(localStorage.getItem('piblay_user'));
    const allUsers = JSON.parse(localStorage.getItem('all_piblay_users')) || [];
    const container = document.getElementById('members-list');
    
    container.innerHTML = "";

    allUsers.forEach((user, index) => {
        // Condition : Seuls les admins OU les membres ayant payé apparaissent
        if (user.role === 'admin' || user.isPaid) {
            
            // Déterminer le badge
            let badgeClass = "";
            let badgeText = "";
            if (user.role === 'admin') { badgeClass = "badge-admin"; badgeText = "ADMIN"; }
            else if (user.role === 'agency') { badgeClass = "badge-agency"; badgeText = "AGENCE"; }
            else { badgeClass = "badge-owner"; badgeText = "PROPRIÉTAIRE"; }

            const memberHTML = `
                <div class="member-card">
                    <div class="member-info">
                        <img src="${user.photo || 'https://ui-avatars.com/api/?name=' + user.email}" class="member-avatar">
                        <div>
                            <strong>${user.email}</strong><br>
                            <span class="badge ${badgeClass}">${badgeText}</span>
                        </div>
                    </div>

                    ${currentUser.role === 'admin' ? `
                        <div class="admin-controls">
                            <button class="btn-kick" onclick="kickMember(${index})">Expulser</button>
                        </div>
                    ` : ''}
                </div>
            `;
            container.innerHTML += memberHTML;
        }
    });
}

// Fonction spéciale Admin pour retirer quelqu'un du groupe (le bloquer)
function kickMember(index) {
    if (confirm("Voulez-vous révoquer l'accès de ce membre au groupe ?")) {
        let allUsers = JSON.parse(localStorage.getItem('all_piblay_users'));
        allUsers[index].isPaid = false; // Désactiver son compte bloque l'accès au groupe
        localStorage.setItem('all_piblay_users', JSON.stringify(allUsers));
        renderMembers();
        alert("Le membre a été expulsé et son accès a été suspendu.");
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    renderMembers();

    document.getElementById('chat-form').addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage();
    });
});

// ENVOYER UN MESSAGE
function sendMessage() {
    const input = document.getElementById('chat-input');
    const user = JSON.parse(localStorage.getItem('piblay_user'));
    
    if (input.value.trim() === "") return;

    const newMessage = {
        sender: user.email,
        role: user.role,
        text: input.value,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: Date.now()
    };

    let messages = JSON.parse(localStorage.getItem('piblay_group_chat')) || [];
    messages.push(newMessage);
    localStorage.setItem('piblay_group_chat', JSON.stringify(messages));

    input.value = "";
    loadMessages();
}

// CHARGER LES MESSAGES
function loadMessages() {
    const chatContainer = document.getElementById('chat-messages');
    const messages = JSON.parse(localStorage.getItem('piblay_group_chat')) || [];
    const currentUser = JSON.parse(localStorage.getItem('piblay_user'));

    chatContainer.innerHTML = "";

    messages.forEach((msg, index) => {
        const isMe = msg.sender === currentUser.email;
        let roleClass = msg.role; // admin, agency, owner
        let badgeColor = msg.role === 'admin' ? '#FFD700' : (msg.role === 'agency' ? '#10b981' : '#3b82f6');

        chatContainer.innerHTML += `
            <div class="msg ${isMe ? 'me' : roleClass}">
                <div class="msg-info">
                    <span style="color:${badgeColor}; font-weight:bold;">${msg.sender.split('@')[0]}</span>
                    <span style="opacity:0.5; font-size:0.6rem;">${msg.time}</span>
                    ${currentUser.role === 'admin' ? `<i class="fas fa-trash" style="color:#ef4444; cursor:pointer; margin-left:10px;" onclick="deleteMessage(${index})"></i>` : ''}
                </div>
                <div class="msg-text">${msg.text}</div>
            </div>
        `;
    });

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// SUPPRIMER UN MESSAGE (ADMIN SEULEMENT)
function deleteMessage(index) {
    if(confirm("Supprimer ce message ?")) {
        let messages = JSON.parse(localStorage.getItem('piblay_group_chat'));
        messages.splice(index, 1);
        localStorage.setItem('piblay_group_chat', JSON.stringify(messages));
        loadMessages();
    }
}

// ... (Garder la fonction renderMembers de l'étape précédente) ...