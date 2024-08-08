document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    const savedRating = localStorage.getItem('rating');

    if (savedRating) {
        updateStars(savedRating);
    }

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = star.getAttribute('data-value');
            const currentRating = localStorage.getItem('rating');

            // If the clicked star is already the rating, reset the rating
            if (currentRating === value) {
                localStorage.removeItem('rating');
                updateStars(0);
            } else {
                localStorage.setItem('rating', value);
                updateStars(value);
            }
        });

        star.addEventListener('mouseover', () => {
            const value = star.getAttribute('data-value');
            updateStars(value);
        });

        star.addEventListener('mouseout', () => {
            const value = localStorage.getItem('rating') || 0;
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
  // Sélection de tous les boutons de favoris sur toutes les pages
  const favoriteButtons = document.querySelectorAll('.favorite-button');

  favoriteButtons.forEach(button => {
    const recipeId = button.getAttribute('data-id');
    const isFavorited = localStorage.getItem(`favorite-${recipeId}`) === 'true';
    
    // Appliquer le style favori si déjà en favoris
    button.classList.toggle('favorited', isFavorited);

    // Ajouter l'événement de clic pour marquer/démarquer les favoris
    button.addEventListener('click', () => {
      const isNowFavorited = !button.classList.contains('favorited');
      button.classList.toggle('favorited', isNowFavorited);
      localStorage.setItem(`favorite-${recipeId}`, isNowFavorited);
    });
  });

  const toggleFavoritesBtn = document.getElementById('toggle-favorites');
  if (toggleFavoritesBtn) {
    toggleFavoritesBtn.addEventListener('click', () => {
      const showFavorites = toggleFavoritesBtn.textContent === 'Afficher les favoris';
      toggleFavoritesBtn.textContent = showFavorites ? 'Afficher tout' : 'Afficher les favoris';
      
      // Afficher ou masquer les recettes en fonction des favoris
      document.querySelectorAll('.recipe-card').forEach(recipe => {
        const recipeId = recipe.getAttribute('data-id');
        const isFavorited = localStorage.getItem(`favorite-${recipeId}`) === 'true';
        recipe.style.display = showFavorites && !isFavorited ? 'none' : '';
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', (event) => {
  const favoriteButton = document.getElementById('favorite-button');

  favoriteButton.addEventListener('click', () => {
    if (favoriteButton.classList.contains('added')) {
      favoriteButton.classList.remove('added');
      favoriteButton.textContent = 'Ajouter aux favoris';
    } else {
      favoriteButton.classList.add('added');
      favoriteButton.textContent = 'Enlever des favoris';
    }
  });
});
