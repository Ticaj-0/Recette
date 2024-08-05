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
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    }, function(err) {
      console.log('Service Worker registration failed:', err);
    });
  });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Affichez une UI pour inviter l'utilisateur à installer l'application
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
