document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderSkeletons();
    fetchSpotlights();
    fetchTopTen();
    fetchTopSearch();
    setupSearch();

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = '#141414';
        } else {
            navbar.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)';
        }
    });
}

function renderSkeletons() {
    // Top Ten Skeletons
    const topTenContainer = document.getElementById('top-ten-list');
    if (topTenContainer) {
        topTenContainer.innerHTML = Array(10).fill(0).map(() => `
            <div class="card-skeleton skeleton-item">
                <div class="poster-skeleton skeleton"></div>
                <div class="text-skeleton skeleton"></div>
                <div class="text-skeleton skeleton" style="width: 60%"></div>
            </div>
        `).join('');
    }

    // Top Search Skeletons
    const searchContainer = document.getElementById('top-search-list');
    if (searchContainer) {
        searchContainer.innerHTML = Array(10).fill(0).map(() => `
            <div class="tag-skeleton skeleton"></div>
        `).join('');
    }
}

/* --- Search Functionality --- */
function setupSearch() {
    // Desktop Elements
    const searchInput = document.getElementById('search-input');
    const clearIcon = document.getElementById('clear-search');
    const suggestionsBox = document.getElementById('search-suggestions');
    const searchIcon = document.querySelector('.desktop-search .search-icon');

    // Mobile Elements
    const mobileToggle = document.querySelector('.mobile-search-toggle');
    const mobileOverlay = document.getElementById('mobile-search-overlay');
    const mobileInput = document.getElementById('mobile-search-input');
    const mobileClose = document.getElementById('mobile-search-close');
    const mobileSuggestionsBox = document.getElementById('mobile-search-suggestions');
    const bottomNavSearch = document.getElementById('bottom-nav-search');

    // Shared Elements
    const closeSearchBtn = document.getElementById('close-search');

    let debounceTimer;

    // --- Desktop Logic ---
    const handleInput = (inputEl, suggestionsEl, clearEl) => {
        const keyword = inputEl.value.trim();

        if (clearEl) clearEl.style.display = keyword ? 'block' : 'none';

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (keyword.length > 1) {
                fetchSuggestions(keyword, suggestionsEl);
            } else {
                suggestionsEl.style.display = 'none';
            }
        }, 300);
    };

    const handleEnter = (e, inputEl, suggestionsEl) => {
        if (e.key === 'Enter') {
            const keyword = inputEl.value.trim();
            if (keyword) {
                performSearch(keyword);
                suggestionsEl.style.display = 'none';
                inputEl.blur();
                // Close overlay if mobile
                mobileOverlay.style.display = 'none';
            }
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', () => handleInput(searchInput, suggestionsBox, clearIcon));
        searchInput.addEventListener('keypress', (e) => handleEnter(e, searchInput, suggestionsBox));
    }

    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            const keyword = searchInput.value.trim();
            if (keyword) {
                performSearch(keyword);
            } else {
                searchInput.focus();
            }
        });
    }

    if (clearIcon) {
        clearIcon.addEventListener('click', () => {
            searchInput.value = '';
            clearIcon.style.display = 'none';
            suggestionsBox.style.display = 'none';
            searchInput.focus();
        });
    }

    // --- Mobile Logic ---
    const openMobileSearch = () => {
        mobileOverlay.style.display = 'flex';
        mobileInput.focus();
    };

    const closeMobileSearch = () => {
        mobileOverlay.style.display = 'none';
        mobileInput.value = '';
        mobileSuggestionsBox.style.display = 'none';
    };

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileSearch);
    if (bottomNavSearch) bottomNavSearch.addEventListener('click', (e) => {
        e.preventDefault();
        openMobileSearch();
    });

    if (mobileClose) mobileClose.addEventListener('click', closeMobileSearch);

    if (mobileInput) {
        mobileInput.addEventListener('input', () => handleInput(mobileInput, mobileSuggestionsBox, null));
        mobileInput.addEventListener('keypress', (e) => handleEnter(e, mobileInput, mobileSuggestionsBox));
    }

    // --- General Close ---
    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', () => {
            document.getElementById('search-results-view').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            document.body.style.overflow = 'auto';
        });
    }

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container') && !e.target.closest('.mobile-search-overlay')) {
            if (suggestionsBox) suggestionsBox.style.display = 'none';
        }
    });
}

async function fetchSuggestions(keyword, suggestionsContainer) {
    try {
        const response = await fetch(`/api/search/suggest?keyword=${encodeURIComponent(keyword)}`);
        const data = await response.json();

        if (data.success && data.results && data.results.length > 0) {
            suggestionsContainer.innerHTML = '';
            data.results.slice(0, 5).forEach(item => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.onclick = () => {
                     window.location.href = `/${item.id}`;
                };

                const img = document.createElement('img');
                img.src = item.poster;
                img.className = 'suggestion-poster';
                div.appendChild(img);

                const info = document.createElement('div');
                info.className = 'suggestion-info';

                const title = document.createElement('div');
                title.className = 'suggestion-title';
                title.textContent = item.name;
                info.appendChild(title);

                const meta = document.createElement('div');
                meta.className = 'suggestion-meta';
                meta.textContent = item.moreInfo ? item.moreInfo.join(' • ') : '';
                info.appendChild(meta);

                div.appendChild(info);
                suggestionsContainer.appendChild(div);
            });
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

async function performSearch(keyword) {
    const mainContent = document.getElementById('main-content');
    const resultsView = document.getElementById('search-results-view');
    const resultsGrid = document.getElementById('search-results-grid');
    const loading = document.getElementById('search-loading');
    const title = document.getElementById('search-query-title');

    // Switch views
    mainContent.style.display = 'none';
    resultsView.style.display = 'block';
    resultsGrid.innerHTML = '';
    loading.style.display = 'block';
    title.textContent = `Search Results for "${keyword}"`;

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

/* --- Existing Features --- */

async function fetchSpotlights() {
    const heroSection = document.getElementById('hero-section');
    if (!heroSection) return;
    try {
        const response = await fetch('/api');
        const data = await response.json();

        if (data.success && data.results.spotlights && data.results.spotlights.length > 0) {
            const spotlight = data.results.spotlights[0]; // Use the first one for Hero

            // Clear skeletons
            heroSection.innerHTML = '';

            const slide = document.createElement('div');
            slide.className = 'hero-slide';
            slide.style.backgroundImage = `url('${spotlight.poster}')`;
            heroSection.appendChild(slide);

            const overlay = document.createElement('div');
            overlay.className = 'hero-overlay';
            heroSection.appendChild(overlay);

            const content = document.createElement('div');
            content.className = 'hero-content';

            const title = document.createElement('h1');
            title.className = 'hero-title';
            title.textContent = spotlight.title;
            content.appendChild(title);

            const meta = document.createElement('div');
            meta.className = 'hero-meta';

            if (spotlight.type) {
                const typeSpan = document.createElement('span');
                typeSpan.textContent = spotlight.type || 'TV';
                meta.appendChild(typeSpan);
            }

            if (spotlight.rank) {
                const rankSpan = document.createElement('span');
                rankSpan.textContent = `#${spotlight.rank} Trending`;
                meta.appendChild(rankSpan);
            }
            content.appendChild(meta);

            const desc = document.createElement('p');
            desc.className = 'hero-desc';
            desc.style.color = '#ccc';
            desc.style.marginBottom = '20px';
            desc.style.maxWidth = '500px';
            desc.style.display = '-webkit-box';
            desc.style.webkitLineClamp = '3';
            desc.style.webkitBoxOrient = 'vertical';
            desc.style.overflow = 'hidden';
            desc.textContent = spotlight.description || '';
            content.appendChild(desc);

            const btn = document.createElement('button');
            btn.className = 'hero-btn';
            btn.onclick = () => window.location.href = `/${spotlight.id}`;

            const icon = document.createElement('i');
            icon.className = 'fas fa-play';
            btn.appendChild(icon);
            btn.appendChild(document.createTextNode(' Watch Now'));

            content.appendChild(btn);
            heroSection.appendChild(content);

        }
    } catch (error) {
        console.error('Error fetching spotlight:', error);
        heroSection.textContent = 'Failed to load spotlight';
        heroSection.style.textAlign = 'center';
        heroSection.style.padding = '50px';
    }
}

let topTenDataCache = {};

async function fetchTopTen() {
    const container = document.getElementById('top-ten-list');
    if (!container) return;
    try {
        const response = await fetch('/api/top-ten');
        const data = await response.json();

        if (data.success) {
            topTenDataCache = data.results;
            renderTopTenList('today'); // Default

            // Tabs
            document.querySelectorAll('.tab-btn').forEach(btn => {
                if (btn.id === 'close-search') return; // Skip search close button
                btn.addEventListener('click', (e) => {
                    // Only remove active from sibling tabs
                    const parent = e.target.closest('.tabs');
                    if (parent) {
                        parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        renderTopTenList(e.target.dataset.period);
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error fetching top ten:', error);
        container.textContent = 'Error loading data.';
        container.style.padding = '20px';
    }
}

function renderTopTenList(period) {
    const container = document.getElementById('top-ten-list');
    const list = topTenDataCache[period] || [];

    // Clear skeletons/previous content
    container.innerHTML = '';

    list.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'anime-card';
        card.onclick = () => window.location.href = `/${anime.id}`;

        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';

        const img = document.createElement('img');
        img.src = anime.poster;
        img.alt = anime.title;
        img.className = 'poster-img';
        img.loading = 'lazy';

        const rank = document.createElement('div');
        rank.className = 'rank-badge';
        rank.textContent = anime.number;

        imgContainer.appendChild(img);
        imgContainer.appendChild(rank);

        const info = document.createElement('div');
        info.className = 'card-info';

        const title = document.createElement('div');
        title.className = 'card-title';
        title.textContent = anime.title;

        const meta = document.createElement('div');
        meta.className = 'card-meta';

        const eps = anime.tvInfo.eps ? `${anime.tvInfo.eps} eps` : '';
        const type = anime.tvInfo.sub ? 'SUB' : (anime.tvInfo.dub ? 'DUB' : '');
        meta.textContent = [eps, type].filter(Boolean).join(' • ');

        info.appendChild(title);
        info.appendChild(meta);

        card.appendChild(imgContainer);
        card.appendChild(info);
        container.appendChild(card);
    });
}

async function fetchTopSearch() {
    const container = document.getElementById('top-search-list');
    if (!container) return;
    try {
        const response = await fetch('/api/top-search');
        const data = await response.json();

        if (data.success && Array.isArray(data.results)) {
            container.innerHTML = ''; // Clear skeletons
            data.results.forEach(item => {
                const tag = document.createElement('a');
                tag.href = item.link;
                tag.className = 'tag';
                tag.textContent = item.title;
                container.appendChild(tag);
            });
        }
    } catch (error) {
        console.error('Error fetching top search:', error);
        container.textContent = 'Error loading tags.';
    }
}
