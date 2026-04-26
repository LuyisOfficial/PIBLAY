/**
 * Retour à la page précédente (fallback sécurisé)
 */
function goBack() {
    try {
        // Si historique disponible
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Fallback vers page d'accueil (compatible GitHub Pages)
            window.location.href = "./index.html";
        }
    } catch (err) {
        // Sécurité en cas d'erreur
        window.location.href = "./index.html";
    }
}

// ================= UX BONUS =================

// Message stylé console (debug uniquement)
if (typeof window !== "undefined") {
    console.log(
        "%c⚠️ Erreur 404 : Signal perdu dans l'écosystème PIBLAY.",
        "color:#ec6111;font-size:14px;font-weight:bold;"
    );
}

// ================= ACCESSIBILITÉ =================

// Permet d'utiliser bouton clavier (Enter / Echap)
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        goBack();
    }
});
