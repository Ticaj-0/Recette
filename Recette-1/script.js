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

document.getElementById('show-popup-button').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'block';
});

document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('popup')) {
        document.getElementById('popup').style.display = 'none';
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
