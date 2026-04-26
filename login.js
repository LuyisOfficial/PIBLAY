document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById('loginForm');
    if (!form) return; // ✅ évite crash

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailInput = document.getElementById('loginEmail').value.trim().toLowerCase();
        const passwordInput = document.getElementById('loginPassword').value;
        const statusMsg = document.getElementById('status-msg');

        // 🔐 Emails Admin
        const ADMIN_EMAILS = [
            "info.piblay@gmail.com",
            "odnalouijeune@gmail.com",
            "juntanluyis@gmail.com"
        ];

        // 📦 Récupération users
        const allUsers = JSON.parse(localStorage.getItem('all_piblay_users')) || [];

        // 🔍 Recherche user
        let userFound = allUsers.find(u =>
            u.email?.toLowerCase() === emailInput &&
            u.password === passwordInput
        );

        // 🔥 Auto création ADMIN (sécurité dev uniquement)
        if (!userFound && ADMIN_EMAILS.includes(emailInput)) {
            userFound = {
                email: emailInput,
                password: passwordInput,
                role: 'admin',
                isPaid: true
            };

            allUsers.push(userFound);
            localStorage.setItem('all_piblay_users', JSON.stringify(allUsers));
        }

        // ================= LOGIN OK =================
        if (userFound) {

            const sessionUser = { ...userFound };

            // ADMIN
            if (ADMIN_EMAILS.includes(sessionUser.email.toLowerCase())) {
                sessionUser.role = 'admin';

                localStorage.setItem('piblay_user', JSON.stringify(sessionUser));

                statusMsg.textContent = "Accès admin détecté...";
                statusMsg.style.color = "#FFD700";

                setTimeout(() => {
                    window.location.href = "admin_dashboard.html"; // ✅ OK GitHub
                }, 1000);
            }

            // AGENCY
            else if (sessionUser.role === 'agency') {
                localStorage.setItem('piblay_user', JSON.stringify(sessionUser));
                window.location.href = "proagence.html";
            }

            // CLIENT
            else {
                localStorage.setItem('piblay_user', JSON.stringify(sessionUser));
                window.location.href = "dashboard.html";
            }

        } else {
            statusMsg.textContent = "Identifiants incorrects";
            statusMsg.style.color = "#ef4444";
        }

    });

});
