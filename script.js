document.addEventListener('DOMContentLoaded', function() {
    const recipesGrid = document.querySelector('.recipes-grid');
    const recipes = Array.from(recipesGrid.children);
    const originalOrder = recipes.map(recipe => recipe);
    const sortCriteria = document.getElementById('sort-criteria');
    const searchInput = document.getElementById('search-input');

    const updateStars = (ratingElement, value) => {
        const stars = ratingElement.querySelectorAll('.star');
        stars.forEach(star => {
            star.classList.toggle('filled', parseInt(star.getAttribute('data-value'), 10) <= parseInt(value, 10));
        });
    };

    const updateRecipeRating = (recipe, ratingValue) => {
        recipe.setAttribute('data-rating', ratingValue);
        updateStars(recipe.querySelector('.rating'), ratingValue);
        localStorage.setItem(`rating-${recipe.getAttribute('data-id')}`, ratingValue);
    };

    const sortRecipes = (criteria) => {
        const sortedRecipes = criteria === 'default' ? [...originalOrder] : [...recipesGrid.children].sort((a, b) => {
            const aValue = parseInt(a.getAttribute(`data-${criteria}`), 10) || 0;
            const bValue = parseInt(b.getAttribute(`data-${criteria}`), 10) || 0;
            return criteria === 'rating' ? bValue - aValue : aValue - bValue;
        });

        recipesGrid.innerHTML = '';
        sortedRecipes.forEach(recipe => recipesGrid.appendChild(recipe));
    };

    const filterRecipes = (term) => {
        recipes.forEach(recipe => {
            const title = recipe.querySelector('h2').textContent.toLowerCase();
            const description = recipe.querySelector('p').textContent.toLowerCase();
            recipe.style.display = (title.includes(term) || description.includes(term)) ? '' : 'none';
        });
    };

    const setupStars = () => {
        document.querySelectorAll('.rating').forEach(rating => {
            const stars = rating.querySelectorAll('.star');
            stars.forEach(star => {
                const recipe = rating.closest('.recipe-card');
                const savedRating = localStorage.getItem(`rating-${recipe.getAttribute('data-id')}`) || rating.getAttribute('data-rating');
                recipe.setAttribute('data-rating', savedRating);
                updateStars(rating, savedRating);

                star.addEventListener('click', () => {
                    const value = star.getAttribute('data-value');
                    const currentRating = recipe.getAttribute('data-rating');
                    updateRecipeRating(recipe, value === currentRating ? '0' : value);
                    sortRecipes(sortCriteria.value);
                });

                star.addEventListener('mouseover', () => {
                    updateStars(rating, star.getAttribute('data-value'));
                });

                star.addEventListener('mouseout', () => {
                    updateStars(rating, recipe.getAttribute('data-rating'));
                });
            });
        });
    };

    sortCriteria.addEventListener('change', () => sortRecipes(sortCriteria.value));
    searchInput.addEventListener('input', () => filterRecipes(searchInput.value.toLowerCase()));
    setupStars();
    sortRecipes('default');
});
