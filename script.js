document.addEventListener('DOMContentLoaded', () => {
    // TMDB API configuration
    const TMDB_API_KEY = 'c7ec19ffdd3279641fb606d19ceb9bb1';
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    // Movie data with TMDB IDs
    const movies = [
        { id: 155, title: 'The Dark Knight', rating: 8.52, description: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent...' },
        { id: 27205, title: 'Inception', rating: 8.384, description: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets...' },
        { id: 278, title: 'The Shawshank Redemption', rating: 8.784, description: 'Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne...' },
        { id: 238, title: 'The Godfather', rating: 8.7, description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.' },
        { id: 680, title: 'Pulp Fiction', rating: 8.5, description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.' },
        { id: 13, title: 'Forrest Gump', rating: 8.8, description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.' },
        { id: 550, title: 'Fight Club', rating: 8.4, description: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.' },
        { id: 240, title: 'The Godfather Part II', rating: 8.6, description: 'The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.' },
        { id: 438631, title: 'Dune', rating: 7.782, description: 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.' }
    ];

    // Function to fetch movie poster
    async function fetchMoviePoster(movieId) {
        try {
            const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`);
            const data = await response.json();
            return data.poster_path ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}` : 'Image1.png';
        } catch (error) {
            console.error('Error fetching movie poster:', error);
            return 'Image1.png';
        }
    }

    // Initialize movie posters
    async function initializeMoviePosters() {
        const movieCards = document.querySelectorAll('.movie-card');
        const heroImage = document.querySelector('.hero-image img');

        // Set hero image (Dune)
        const dunePoster = await fetchMoviePoster(438631);
        heroImage.src = dunePoster;

        // Set movie card posters
        for (let i = 0; i < movieCards.length; i++) {
            const poster = await fetchMoviePoster(movies[i].id);
            movieCards[i].querySelector('img').src = poster;
        }
    }

    // Initialize posters when page loads
    initializeMoviePosters();

    // Search functionality
    const searchInput = document.getElementById('movieSearch');
    let debounceTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => handleSearch(e), 500); // Debounce search to avoid too many API calls
    });

    // Navigation menu highlighting
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Movie card hover effects
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Search functionality implementation
async function handleSearch(e) {
    const searchTerm = e.target.value;
    if (!searchTerm) return;

    try {
        const TMDB_API_KEY = 'c7ec19ffdd3279641fb606d19ceb9bb1';
        const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
        const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

        // Search for the movie
        const searchResponse = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchTerm)}`);
        const searchData = await searchResponse.json();

        if (searchData.results.length > 0) {
            const movieId = searchData.results[0].id;

            // Get recommendations for the movie
            const recommendResponse = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}`);
            const recommendData = await recommendResponse.json();

            // Get the top 3 recommendations
            const recommendations = recommendData.results.slice(0, 3);

            // Get the recommendations container
            let recommendationsSection = document.querySelector('.movie-recommendations .movie-list');
            if (!recommendationsSection) {
                recommendationsSection = document.createElement('div');
                recommendationsSection.className = 'movie-list';
                document.querySelector('.movie-recommendations').appendChild(recommendationsSection);
            }
            recommendationsSection.innerHTML = '';

            // Display recommendations
            for (const movie of recommendations) {
                const posterPath = movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'Image1.png';
                const movieCard = document.createElement('div');
                movieCard.className = 'movie-card';
                movieCard.innerHTML = `
                    <img src="${posterPath}" alt="${movie.title}">
                    <div class="movie-details">
                        <h3>${movie.title}</h3>
                        <span class="rating">★ ${movie.vote_average.toFixed(1)}</span>
                        <p>${movie.overview.substring(0, 100)}...</p>
                    </div>
                `;
                recommendationsSection.appendChild(movieCard);
            }
        }
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
}

// Watch Now button functionality
const watchNowBtn = document.querySelector('.watch-now');
if (watchNowBtn) {
    watchNowBtn.addEventListener('click', () => {
        alert('Starting movie playback...');
        // Add your video playback logic here
    });
}

// More Info button functionality
const moreInfoBtn = document.querySelector('.more-info');
if (moreInfoBtn) {
    moreInfoBtn.addEventListener('click', () => {
        // Add your movie details modal or navigation logic here
        alert('Showing more information about the movie...');
    });
}