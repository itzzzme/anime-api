document.addEventListener('DOMContentLoaded', () => {
    setupSearch(); // Initialize navbar search interactions

    // Get query param
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword');

    if (keyword) {
        // Set input values to match query
        const desktopInput = document.getElementById('search-input');
        const mobileInput = document.getElementById('mobile-search-input');
        if (desktopInput) desktopInput.value = keyword;
        if (mobileInput) mobileInput.value = keyword;

        // Perform search
        performPageSearch(keyword);
    } else {
        document.getElementById('search-loading').style.display = 'none';
        document.getElementById('search-query-title').textContent = 'Enter a search term';
    }
});

async function performPageSearch(keyword) {
    const resultsGrid = document.getElementById('search-results-grid');
    const loading = document.getElementById('search-loading');
    const title = document.getElementById('search-query-title');

    loading.style.display = 'block';
    title.textContent = `Search Results for "${keyword}"`;
    resultsGrid.innerHTML = '';

    try {
        const response = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`);
        const data = await response.json();
        loading.style.display = 'none';

        if (data.success && data.results && data.results.data && data.results.data.length > 0) {
            data.results.data.forEach(anime => {
                const card = document.createElement('div');
                card.className = 'anime-card';
                card.onclick = () => window.location.href = `/${anime.id}`;

                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-container';

                const img = document.createElement('img');
                img.src = anime.poster;
                img.alt = anime.name;
                img.className = 'poster-img';
                img.loading = 'lazy';

                imgContainer.appendChild(img);

                // Add rank/type badge if available
                if (anime.type) {
                    const badge = document.createElement('div');
                    badge.className = 'rank-badge';
                    badge.style.fontSize = '0.8rem';
                    badge.textContent = anime.type;
                    imgContainer.appendChild(badge);
                }

                const info = document.createElement('div');
                info.className = 'card-info';

                const titleEl = document.createElement('div');
                titleEl.className = 'card-title';
                titleEl.textContent = anime.name;
                info.appendChild(titleEl);

                const meta = document.createElement('div');
                meta.className = 'card-meta';

                // Construct meta info safely
                let metaText = [];
                if (anime.episodes) {
                     // episodes is an object {sub: X, dub: Y} sometimes
                     const sub = anime.episodes.sub;
                     const dub = anime.episodes.dub;
                     if (sub) metaText.push(`Sub: ${sub}`);
                     if (dub) metaText.push(`Dub: ${dub}`);
                }
                if (anime.duration) metaText.push(anime.duration);

                meta.textContent = metaText.join(' • ');
                info.appendChild(meta);

                card.appendChild(imgContainer);
                card.appendChild(info);
                resultsGrid.appendChild(card);
            });
        } else {
            resultsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">No results found.</p>';
        }

    } catch (error) {
        console.error('Search error:', error);
        loading.style.display = 'none';
        resultsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Error loading results.</p>';
    }
}
