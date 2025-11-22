document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderSkeletons();
    fetchSpotlights();
    fetchTopTen();
    fetchTopSearch();
    setupSearch(); // Defined in navbar.js

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = '#141414';
            } else {
                navbar.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)';
            }
        });
    }
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
