document.addEventListener('DOMContentLoaded', function() {
    const recipesGrid = document.querySelector('.recipes-grid');
    const recipes = Array.from(recipesGrid.children);
    const originalOrder = recipes.map(recipe => recipe);
    function updateStars(ratingElement, value) {
        const stars = ratingElement.querySelectorAll('.star');
        stars.forEach(star => {
            if (parseInt(star.getAttribute('data-value'), 10) <= parseInt(value, 10)) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }
    function updateRecipeRating(recipe, ratingValue) {
        recipe.setAttribute('data-rating', ratingValue);
        updateStars(recipe.querySelector('.rating'), ratingValue);
        localStorage.setItem(`rating-${recipe.getAttribute('data-id')}`, ratingValue);
    }
    function sortRecipes(criteria) {
        let sortedRecipes;
        if (criteria === 'default') {
            sortedRecipes = [...originalOrder];
        } else {
            sortedRecipes = [...recipesGrid.children].sort((a, b) => {
                const aValue = parseInt(a.getAttribute(`data-${criteria}`), 10) || 0;
                const bValue = parseInt(b.getAttribute(`data-${criteria}`), 10) || 0;
                return criteria === 'rating' ? bValue - aValue : aValue - bValue;
            });
        }
        recipesGrid.innerHTML = '';
        sortedRecipes.forEach(recipe => recipesGrid.appendChild(recipe));
    }
    function filterRecipes(term) {
        recipes.forEach(recipe => {
            const title = recipe.querySelector('h2').textContent.toLowerCase();
            const description = recipe.querySelector('p').textContent.toLowerCase();
            recipe.style.display = (title.includes(term) || description.includes(term)) ? '' : 'none';
        });
    }
    function setupStars() {
        document.querySelectorAll('.rating').forEach(rating => {
            const stars = rating.querySelectorAll('.star');
            stars.forEach(star => {
                star.addEventListener('click', () => {
                    const value = star.getAttribute('data-value');
                    const recipe = rating.closest('.recipe-card');
                    const currentRating = recipe.getAttribute('data-rating');
                    // Update the rating and sort recipes
                    updateRecipeRating(recipe, value === currentRating ? '0' : value);
                    sortRecipes(document.getElementById('sort-criteria').value);
                });
                star.addEventListener('mouseover', () => {
                    // Highlight stars up to the hovered star
                    updateStars(rating, star.getAttribute('data-value'));
                });
                star.addEventListener('mouseout', () => {
                    // Restore stars to the current rating
                    const recipe = rating.closest('.recipe-card');
                    updateStars(rating, recipe.getAttribute('data-rating'));
                });
            });
            // Initialize stars for each rating
            const recipe = rating.closest('.recipe-card');
            const savedRating = localStorage.getItem(`rating-${recipe.getAttribute('data-id')}`) || rating.getAttribute('data-rating');
            recipe.setAttribute('data-rating', savedRating);
            updateStars(rating, savedRating);
        });
    }
    document.getElementById('sort-criteria').addEventListener('change', function() {
        sortRecipes(this.value);
    });
    document.getElementById('search-input').addEventListener('input', function() {
        filterRecipes(this.value.toLowerCase());
    });
    setupStars();
    sortRecipes('default');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/Recette/service-worker.js').then(function(registration) {
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
      const showFavorites = !toggleFavoritesBtn.classList.contains('showing-all');
      toggleFavoritesBtn.classList.toggle('showing-all', showFavorites);
      
      // Afficher ou masquer les recettes en fonction des favoris
      document.querySelectorAll('.recipe-card').forEach(recipe => {
        const recipeId = recipe.getAttribute('data-id');
        const isFavorited = localStorage.getItem(`favorite-${recipeId}`) === 'true';
        recipe.style.display = showFavorites && !isFavorited ? 'none' : '';
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.recipe').forEach(recipe => {
        const pageId = recipe.getAttribute('data-id');
        const stars = recipe.querySelectorAll('.star');
        const savedRating = localStorage.getItem(`rating-${pageId}`);
        
        if (savedRating) {
            updateStars(stars, savedRating);
        }

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.getAttribute('data-value');
                const currentRating = localStorage.getItem(`rating-${pageId}`);
                if (currentRating === value) {
                    localStorage.removeItem(`rating-${pageId}`);
                    updateStars(stars, 0);
                } else {
                    localStorage.setItem(`rating-${pageId}`, value);
                    updateStars(stars, value);
                }
            });

            star.addEventListener('mouseover', () => {
                const value = star.getAttribute('data-value');
                updateStars(stars, value);
            });

            star.addEventListener('mouseout', () => {
                const value = localStorage.getItem(`rating-${pageId}`) || 0;
                updateStars(stars, value);
            });
        });
    });

    function updateStars(stars, value) {
        stars.forEach(s => s.classList.remove('filled'));
        for (let i = 0; i < value; i++) {
            stars[i].classList.add('filled');
        }
    }
});
