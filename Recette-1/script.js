document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour mettre à jour les étoiles
    function updateStars(stars, value) {
        stars.forEach(s => s.classList.remove('filled'));
        for (let i = 0; i < value; i++) {
            stars[i].classList.add('filled');
        }
    }

    // Gestion des étoiles pour une recette spécifique
    function setupRating(recipeId) {
        const stars = document.querySelectorAll('.star');
        const savedRating = localStorage.getItem(rating-${recipeId}) || 0;

        updateStars(stars, savedRating);

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.getAttribute('data-value');
                const currentRating = localStorage.getItem(rating-${recipeId});

                if (currentRating === value) {
                    localStorage.removeItem(rating-${recipeId});
                    updateStars(stars, 0);
                } else {
                    localStorage.setItem(rating-${recipeId}, value);
                    updateStars(stars, value);
                }
            });

            star.addEventListener('mouseover', () => {
                const value = star.getAttribute('data-value');
                updateStars(stars, value);
            });

            star.addEventListener('mouseout', () => {
                const value = localStorage.getItem(rating-${recipeId}) || 0;
                updateStars(stars, value);
            });
        });
    }

    // Initialise le système de notation pour la page principale
    document.querySelectorAll('.recipe-card').forEach(recipe => {
        const recipeId = recipe.getAttribute('data-id');
        setupRating(recipeId);
    });

    // Initialise le système de notation pour la page de description
    const descriptionRecipeId = document.querySelector('.recipe-header').getAttribute('data-id');
    if (descriptionRecipeId) {
        setupRating(descriptionRecipeId);
    }

    // Gestion du bouton de favoris
    function updateFavoriteButton(button, isFavorited) {
        if (isFavorited) {
            button.classList.add('favorited');
            button.textContent = 'Enlever des favoris';
        } else {
            button.classList.remove('favorited');
            button.textContent = 'Sur la liste de favoris';
        }
    }

    const favoriteButtons = document.querySelectorAll('.favorite-button');

    favoriteButtons.forEach(button => {
        const recipeId = button.getAttribute('data-id');
        const isFavorited = localStorage.getItem(favorite-${recipeId}) === 'true';
        updateFavoriteButton(button, isFavorited);

        button.addEventListener('click', () => {
            const isNowFavorited = !button.classList.contains('favorited');
            localStorage.setItem(favorite-${recipeId}, isNowFavorited);
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
                const isFavorited = localStorage.getItem(favorite-${recipeId}) === 'true';
                recipe.style.display = showFavorites && !isFavorited ? 'none' : '';
            });
        });
    }
});

// Enregistrement du service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('https://ticaj-0.github.io/Recette/service-worker.js').then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        }, function(err) {
            console.log('Service Worker registration failed:', err);
        });
    });
}

// Gestion de l'installation de l'app
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
