/**
 * Fonction pour retourner à la page précédente
 */
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}

// Optionnel : Ajout d'un petit effet de console pour les curieux
console.log("%c Erreur 404 : Signal perdu dans l'écosystème Piblay.", "color: #ec6111; font-size: 16px; font-weight: bold;");

