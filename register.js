document.addEventListener('DOMContentLoaded', () => {

    const msgBox = document.getElementById('status-msg');

    // ================= SESSION CHECK =================
    const currentUser = JSON.parse(localStorage.getItem('piblay_user'));

    if (currentUser && currentUser.role === 'agency') {
        window.location.href = "proagence.html"; // ✅ FIX
        return;
    }

    // ================= SWITCH FORM =================
    window.showForm = function(type) {

        msgBox.style.display = 'none';

        document.querySelectorAll('form').forEach(f => {
            f.classList.remove('active');
        });

        if(type === 'login'){
            document.getElementById('loginForm').classList.add('active');
        }
        else if(type === 'signup'){
            document.getElementById('signupForm').classList.add('active');
        }
        else{
            document.getElementById('forgotForm').classList.add('active');
        }
    }

    // ================= LOGIN =================
    const loginForm = document.getElementById('loginForm');

    if(loginForm){
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const pass = document.getElementById('loginPass').value;

            const users = JSON.parse(localStorage.getItem('all_piblay_users')) || [];

            const user = users.find(u => u.email === email && u.password === pass);

            if(!user){
                msgBox.innerText = "Identifiants incorrects";
                msgBox.style.display = "block";
                return;
            }

            if(user.role !== "agency"){
                msgBox.innerText = "Accès réservé aux agences";
                msgBox.style.display = "block";
                return;
            }

            localStorage.setItem('piblay_user', JSON.stringify(user));

            window.location.href = "proagence.html"; // ✅ FIX
        });
    }

    // ================= SIGNUP =================
    const signupForm = document.getElementById('signupForm');

    if(signupForm){
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('regEmail').value.trim().toLowerCase();

            let users = JSON.parse(localStorage.getItem('all_piblay_users')) || [];

            if(users.find(u => u.email === email)){
                msgBox.innerText = "Email déjà utilisé";
                msgBox.style.display = "block";
                return;
            }

            const newUser = {
                fullname: document.getElementById('regName').value,
                email: email,
                password: document.getElementById('regPass').value,
                role: "agency",
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('all_piblay_users', JSON.stringify(users));
            localStorage.setItem('piblay_user', JSON.stringify(newUser));

            alert("Compte créé !");
            window.location.href = "proagence.html"; // ✅ FIX
        });
    }

});
