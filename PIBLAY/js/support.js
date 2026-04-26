document.addEventListener('DOMContentLoaded', () => {
    // 1. Détection de l'utilisateur
    const user = JSON.parse(localStorage.getItem('piblay_user'));

    if (!user) {
        alert("Session expirée. Veuillez vous reconnecter.");
        window.location.href = "connexion.html";
        return;
    }

    const badgeContainer = document.getElementById('badgeContainer');
    const userWelcome = document.getElementById('supportUser');

    // 2. Initialisation de l'interface selon le rôle
    if (user.role === 'agency') {
        document.getElementById('agencySupport').classList.add('active-view');
        badgeContainer.innerHTML = '<span class="role-badge" style="background: var(--agency-green);">Partenaire Agence</span>';
        userWelcome.innerText = `Espace technique : ${user.agencyName || user.fullname}`;
        
        // Listener Formulaire Agence
        document.getElementById('agencyTicketForm').addEventListener('submit', (e) => handleTicket(e, 'agency', user));
    } 
    else {
        document.getElementById('clientSupport').classList.add('active-view');
        badgeContainer.innerHTML = '<span class="role-badge" style="background: var(--client-blue);">Propriétaire Business</span>';
        userWelcome.innerText = `Espace client : ${user.fullname}`;
        
        // Listener Formulaire Client
        document.getElementById('clientTicketForm').addEventListener('submit', (e) => handleTicket(e, 'owner', user));
    }
});

/**
 * Gère l'envoi et le stockage des tickets de support
 */
function handleTicket(event, role, user) {
    event.preventDefault();
    
    const subjectId = role === 'agency' ? 'agencySubject' : 'clientSubject';
    const msgId = role === 'agency' ? 'agencyMsg' : 'clientMsg';
    
    const subject = document.getElementById(subjectId).value;
    const message = document.getElementById(msgId).value.trim();

    if (!message) {
        alert("Veuillez décrire votre problème avant d'envoyer.");
        return;
    }

    const newTicket = {
        id: "TKT-" + Math.floor(Math.random() * 9999),
        sender: user.fullname,
        email: user.email,
        role: role,
        date: new Date().toLocaleString('fr-FR'),
        subject: subject,
        message: message,
        status: "Ouvert"
    };

    // Sauvegarde dans le système global (accessible par l'admin)
    try {
        let allTickets = JSON.parse(localStorage.getItem('piblay_support_tickets')) || [];
        allTickets.push(newTicket);
        localStorage.setItem('piblay_support_tickets', JSON.stringify(allTickets));

        alert(`Merci ! Votre ticket ${newTicket.id} a été transmis. Une réponse vous sera envoyée à ${user.email}`);
        event.target.reset();
    } catch (err) {
        alert("Erreur lors de l'envoi. Veuillez vérifier l'espace disque de votre navigateur.");
    }
}
