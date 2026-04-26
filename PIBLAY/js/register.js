const msgBox = document.getElementById('status-msg');

// VERIFICATION INITIALE : Si déjà connecté, redirection
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem('piblay_user'));
    if (currentUser && currentUser.role === 'agency') {
        window.location.href = '/proagence';
    }
};

// GESTION DE L'AFFICHAGE DES FORMULAIRES
function showForm(type) {
    msgBox.style.display = 'none';
    document.querySelectorAll('form').forEach(f => f.classList.remove('active'));
    document.getElementById('toggleBar').style.display = (type === 'forgot') ? 'none' : 'flex';
    
    if(type === 'login') {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('loginT').classList.add('active');
        document.getElementById('signupT').classList.remove('active');
    } else if(type === 'signup') {
        document.getElementById('signupForm').classList.add('active');
        document.getElementById('signupT').classList.add('active');
        document.getElementById('loginT').classList.remove('active');
    } else {
        document.getElementById('forgotForm').classList.add('active');
    }
}

// --- LOGIQUE INSCRIPTION ---
document.getElementById('signupForm').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    
    let allUsers = JSON.parse(localStorage.getItem('all_piblay_users')) || [];
    if (allUsers.find(u => u.email === email)) {
        msgBox.innerText = "Cet email est déjà utilisé.";
        msgBox.style.display = 'block';
        return;
    }

    const newAgency = {
        fullname: document.getElementById('regName').value,
        email: email,
        password: document.getElementById('regPass').value,
        role: 'agency',
        socials: {
            facebook: document.getElementById('fbLink').value,
            instagram: document.getElementById('igLink').value,
            linkedin: document.getElementById('liLink').value,
            tiktok: document.getElementById('tkLink').value,
            website: document.getElementById('webLink').value
        },
        registrationDate: new Date().toLocaleDateString()
    };

    allUsers.push(newAgency);
    localStorage.setItem('all_piblay_users', JSON.stringify(allUsers));
    localStorage.setItem('piblay_user', JSON.stringify(newAgency)); 

    alert("Bienvenue ! Redirection vers votre espace...");
    window.location.replace('/proagence');
};

// --- LOGIQUE CONNEXION ---
document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value;

    let allUsers = JSON.parse(localStorage.getItem('all_piblay_users')) || [];
    const user = allUsers.find(u => u.email === email && u.password === pass);

    if (user) {
        if (user.role !== 'agency') {
            msgBox.innerText = "Accès réservé aux agences.";
            msgBox.style.display = 'block';
            return;
        }
        localStorage.setItem('piblay_user', JSON.stringify(user));
        window.location.replace('/proagence');
    } else {
        msgBox.innerText = "Identifiants incorrects.";
        msgBox.style.display = 'block';
    }
};

// --- LOGIQUE MOT DE PASSE OUBLIÉ ---
function handleForgot() {
    const email = document.getElementById('forgotEmail').value.trim().toLowerCase();
    let allUsers = JSON.parse(localStorage.getItem('all_piblay_users')) || [];
    const userIndex = allUsers.findIndex(u => u.email === email && u.role === 'agency');
    const btn = document.getElementById('forgotBtn');

    if (userIndex === -1) {
        alert("Email introuvable.");
        return;
    }

    if (btn.innerText === "VÉRIFIER L'EMAIL") {
        document.getElementById('resetFields').style.display = 'block';
        document.getElementById('forgotEmail').readOnly = true;
        btn.innerText = "METTRE À JOUR";
    } else {
        const newPass = document.getElementById('newPass').value;
        if(newPass.length < 6) { alert("6 caractères minimum."); return; }
        
        allUsers[userIndex].password = newPass;
        localStorage.setItem('all_piblay_users', JSON.stringify(allUsers));
        alert("Succès ! Connectez-vous.");
        showForm('login');
    }
}

let base64Logo = "";

// Aperçu de la photo
document.getElementById('regPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('img-preview').src = event.target.result;
            document.getElementById('img-preview').style.display = "block";
            document.getElementById('camera-icon').style.display = "none";
            base64Logo = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Afficher dynamiquement le champ ID selon le choix
function togglePlatform(platform) {
    document.querySelectorAll('.id-input-field').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.id-input-field').forEach(el => el.removeAttribute('required'));
    
    const targetInput = document.getElementById(platform + 'ID');
    targetInput.style.display = 'block';
    targetInput.setAttribute('required', 'true');
}

// Inscription de l'agence
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const agencyID = "AG-" + Math.floor(100000 + Math.random() * 900000);
    const selectedPlatform = document.querySelector('input[name="specialization"]:checked').value;
    const adsID = document.getElementById(selectedPlatform + 'ID').value;

    const newAgency = {
        agencyName: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value.trim().toLowerCase(),
        password: document.getElementById('regPass').value,
        photo: base64Logo || "https://ui-avatars.com/api/?background=10b981&color=fff&name=" + document.getElementById('regName').value,
        role: 'agency',
        specialization: selectedPlatform,
        adsAccountID: adsID,
        agencyID: agencyID,
        
        // --- SYSTEME AFFILIATION ---
        referralLink: "https://www.piblay.com/insagence?ref=" + agencyID,
        totalEarnings: 0,
        referredClients: [], // Liste des IDs clients apportés
        commissionPerClient: 5 // 5$ par mois
    };

    let allUsers = JSON.parse(localStorage.getItem('all_piblay_users')) || [];
    
    if (allUsers.find(u => u.email === newAgency.email)) {
        alert("Cet email est déjà enregistré !");
        return;
    }

    allUsers.push(newAgency);
    localStorage.setItem('all_piblay_users', JSON.stringify(allUsers));
    localStorage.setItem('piblay_user', JSON.stringify(newAgency));

    alert("Compte Agence créé ! Votre lien d'affiliation : " + newAgency.referralLink);
    window.location.href = "/proagence";
});



let base64Image = "";

// Gérer l'aperçu de la photo de profil
document.getElementById('profilePhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('profile-preview').src = event.target.result;
            document.getElementById('profile-preview').style.display = "block";
            document.getElementById('camera-icon').style.display = "none";
            base64Image = event.target.result; // On stocke l'image
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('ownerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newUser = {
        fullname: document.getElementById('fullname').value,
        businessName: document.getElementById('businessName').value,
        website: document.getElementById('website').value, // Facultatif
        businessType: document.getElementById('businessType').value,
        email: document.getElementById('email').value.trim().toLowerCase(),
        password: document.getElementById('password').value,
        photo: base64Image || "https://ui-avatars.com/api/?name=" + document.getElementById('fullname').value,
        role: 'owner',
        isPaid: false, // Doit activer son compte pour le groupe
        adAccountId: "ID-" + Math.floor(Math.random() * 1000000) // Génération ID auto
    };

    // Sauvegarde
    let allUsers = JSON.parse(localStorage.getItem('all_piblay_users')) || [];
    
    // Vérifier si l'email existe déjà
    if (allUsers.find(u => u.email === newUser.email)) {
        document.getElementById('status-msg').textContent = "Cet email est déjà utilisé.";
        return;
    }

    allUsers.push(newUser);
    localStorage.setItem('all_piblay_users', JSON.stringify(allUsers));
    
    // Connecter l'utilisateur immédiatement après inscription
    localStorage.setItem('piblay_user', JSON.stringify(newUser));

    alert("Inscription réussie ! Bienvenue sur PIBLAY.");
    window.location.href = "dashboard.html";
});
