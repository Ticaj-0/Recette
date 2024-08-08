document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    const pageId = 'recette-1'; // Remplacez par l'identifiant unique de chaque page
const savedRating = localStorage.getItem(`rating-${pageId}`);
if (savedRating) {
    updateStars(savedRating);
}
stars.forEach(star => {
    star.addEventListener('click', () => {
        const value = star.getAttribute('data-value');
        const currentRating = localStorage.getItem(`rating-${pageId}`);
        if (currentRating === value) {
            localStorage.removeItem(`rating-${pageId}`);
            updateStars(0);
        } else {
            localStorage.setItem(`rating-${pageId}`, value);
            updateStars(value);
        }
    });
    star.addEventListener('mouseover', () => {
        const value = star.getAttribute('data-value');
        updateStars(value);
    });
    star.addEventListener('mouseout', () => {
        const value = localStorage.getItem(`rating-${pageId}`) || 0;
        updateStars(value);
    });
});

    function updateStars(value) {
        stars.forEach(s => s.classList.remove('filled'));
        for (let i = 0; i < value; i++) {
            stars[i].classList.add('filled');
        }
    }
});
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('https://ticaj-0.github.io/Recette/service-worker.js').then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        }, function(err) {
            console.log('Service Worker registration failed:', err);
        });
    });
}
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt Event fired');
    e.preventDefault();
    deferredPrompt = e;
    const installButton = document.getElementById('installButton');
    installButton.style.display = 'block';
    installButton.addEventListener('click', () => {
        installButton.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
        // Fonction pour mettre à jour l'état du bouton de favoris
    function updateFavoriteButton(button, isFavorited) {
        if (isFavorited) {
            button.classList.add('favorited');
            button.textContent = 'Enlever des favoris';
        } else {
            button.classList.remove('favorited');
            button.textContent = 'Sur la liste de favoris';
        }
    }

    // Sélection des boutons de favoris
    const favoriteButtons = document.querySelectorAll('.favorite-button');
       favoriteButtons.forEach(button => {
        const recipeId = button.getAttribute('data-id');
        const isFavorited = localStorage.getItem(`favorite-${recipeId}`) === 'true';

        // Met à jour le style du bouton en fonction de l'état des favoris
        updateFavoriteButton(button, isFavorited);

        // Ajout de l'événement de clic pour gérer les favoris
        button.addEventListener('click', () => {
            const isNowFavorited = !button.classList.contains('favorited');
            localStorage.setItem(`favorite-${recipeId}`, isNowFavorited);
            updateFavoriteButton(button, isNowFavorited);
        });
    });
       // Gestion de l'affichage des favoris
    const toggleFavoritesBtn = document.getElementById('toggle-favorites');
    if (toggleFavoritesBtn) {
        toggleFavoritesBtn.addEventListener('click', () => {
            const showFavorites = !toggleFavoritesBtn.classList.contains('showing-all');
            toggleFavoritesBtn.classList.toggle('showing-all', showFavorites);

            document.querySelectorAll('.recipe-card').forEach(recipe => {
                const recipeId = recipe.getAttribute('data-id');
                const isFavorited = localStorage.getItem(`favorite-${recipeId}`) === 'true';
                recipe.style.display = showFavorites && !isFavorited ? 'none' : '';
            });
        });
    }
    });
