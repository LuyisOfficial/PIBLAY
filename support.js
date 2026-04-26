document.addEventListener('DOMContentLoaded', () => {

    // ================= USER =================
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('piblay_user'));
    } catch (e) {
        console.error("Erreur parsing user:", e);
    }

    if (!user) {
        alert("Session expirée. Veuillez vous reconnecter.");
        window.location.href = "login.html"; // ✅ corrige chemin
        return;
    }

    const badgeContainer = document.getElementById('badgeContainer');
    const userWelcome = document.getElementById('supportUser');

    // sécurité DOM
    if (!badgeContainer || !userWelcome) return;

    // ================= ROLE UI =================
    if (user.role === 'agency') {

        const agencyView = document.getElementById('agencySupport');
        if (agencyView) agencyView.classList.add('active-view');

        badgeContainer.innerHTML =
            '<span class="role-badge" style="background: var(--agency-green);">Partenaire Agence</span>';

        userWelcome.innerText =
            `Espace technique : ${user.agencyName || user.fullname || "Utilisateur"}`;

        const form = document.getElementById('agencyTicketForm');
        if (form) {
            form.addEventListener('submit', (e) => handleTicket(e, 'agency', user));
        }

    } else {

        const clientView = document.getElementById('clientSupport');
        if (clientView) clientView.classList.add('active-view');

        badgeContainer.innerHTML =
            '<span class="role-badge" style="background: var(--client-blue);">Propriétaire Business</span>';

        userWelcome.innerText =
            `Espace client : ${user.fullname || "Utilisateur"}`;

        const form = document.getElementById('clientTicketForm');
        if (form) {
            form.addEventListener('submit', (e) => handleTicket(e, 'client', user));
        }
    }

});


// ================= HANDLE TICKET =================
function handleTicket(event, role, user) {

    event.preventDefault();

    const subjectId = role === 'agency' ? 'agencySubject' : 'clientSubject';
    const msgId = role === 'agency' ? 'agencyMsg' : 'clientMsg';

    const subjectEl = document.getElementById(subjectId);
    const msgEl = document.getElementById(msgId);

    if (!subjectEl || !msgEl) {
        alert("Erreur formulaire");
        return;
    }

    const subject = subjectEl.value;
    const message = msgEl.value.trim();

    if (!message) {
        alert("Veuillez décrire votre problème.");
        return;
    }

    const newTicket = {
        id: "TKT-" + Date.now(), // ✅ unique
        sender: user.fullname || "Utilisateur",
        email: user.email,
        role: role,
        date: new Date().toISOString(),
        subject,
        message,
        status: "Ouvert"
    };

    try {

        let allTickets = JSON.parse(localStorage.getItem('piblay_support_tickets')) || [];

        allTickets.push(newTicket);

        localStorage.setItem(
            'piblay_support_tickets',
            JSON.stringify(allTickets)
        );

        alert(`Ticket ${newTicket.id} envoyé ✔`);

        event.target.reset();

    } catch (err) {
        console.error(err);
        alert("Erreur stockage navigateur");
    }
}
