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

    let debounceTimer;

    // --- Helper: Redirect to search page ---
    const redirectToSearch = (keyword) => {
        if (keyword) {
            window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
        }
    };

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
                suggestionsEl.style.display = 'none';
                inputEl.blur();
                redirectToSearch(keyword);
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
                redirectToSearch(keyword);
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
        if (mobileOverlay) {
            mobileOverlay.style.display = 'flex';
            mobileInput.focus();
        }
    };

    const closeMobileSearch = () => {
        if (mobileOverlay) {
            mobileOverlay.style.display = 'none';
            mobileInput.value = '';
            mobileSuggestionsBox.style.display = 'none';
        }
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
