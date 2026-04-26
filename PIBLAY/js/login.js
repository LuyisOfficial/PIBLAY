document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('loginEmail').value.trim().toLowerCase();
    const passwordInput = document.getElementById('loginPassword').value;
    const statusMsg = document.getElementById('status-msg');

    // 1. Liste des emails Maîtres (en minuscules)
    const ADMIN_EMAILS = ["info.piblay@gmail.com","odnalouijeune@gmail.com", "juntanluyis@gmail.com"];

    // 2. Récupération des utilisateurs
    const allUsers = JSON.parse(localStorage.getItem('all_piblay_users')) || [];

    // 3. Recherche de l'utilisateur (on force tout en minuscules pour la comparaison)
    let userFound = allUsers.find(u => u.email.toLowerCase() === emailInput && u.password === passwordInput);

    // --- SÉCURITÉ SUPPLÉMENTAIRE ---
    // Si l'utilisateur n'est pas dans la liste MAIS que c'est un de tes emails admin, 
    // on le crée automatiquement pour ne pas rester bloqué dehors.
    if (!userFound && ADMIN_EMAILS.includes(emailInput)) {
        userFound = { email: emailInput, password: passwordInput, role: 'admin', isPaid: true };
        allUsers.push(userFound);
        localStorage.setItem('all_piblay_users', JSON.stringify(allUsers));
    }

    if (userFound) {
        // Nettoyage de l'objet utilisateur pour la session
        const sessionUser = { ...userFound };

        // 4. Vérification du rôle Admin
        if (ADMIN_EMAILS.includes(sessionUser.email.toLowerCase())) {
            sessionUser.role = 'admin';
            localStorage.setItem('piblay_user', JSON.stringify(sessionUser));
            
            statusMsg.innerHTML = "<b style='color:#FFD700'>Accès Maître détecté... Redirection</b>";
            setTimeout(() => { window.location.href = "admin_dashboard.html"; }, 1000);
        } 
        // 5. Redirection Agence
        else if (sessionUser.role === 'agency') {
            localStorage.setItem('piblay_user', JSON.stringify(sessionUser));
            window.location.href = "proagence.html";
        } 
        // 6. Redirection Client
        else {
            localStorage.setItem('piblay_user', JSON.stringify(sessionUser));
            window.location.href = "dashboard.html";
        }
    } else {
        statusMsg.innerHTML = "<span style='color:#ef4444'>Erreur : Identifiants incorrects.</span>";
    }
});
