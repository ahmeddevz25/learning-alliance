/**
 * Learning Alliance - Client-side Search System
 * Searches across all static pages using an index and displays results in a premium modal.
 */

const searchIndex = [
    {
        url: "home.html",
        title: "Home - Learning Alliance",
        badge: "Home",
        description: "Welcome to Learning Alliance. Explore our academic programmes, school values, Executive Principal's message, university placements, news & events, and school magazines.",
        keywords: "home homepage learning alliance executive principal anjum ahmed values ethos mission statement why la placement university placements yearbook magazine admissions explore news events"
    },
    {
        url: "about-us.html",
        title: "About Us - Learning Alliance",
        badge: "About",
        description: "Discover the history, ethos, philosophy, and leadership of Learning Alliance. Read about our journey towards academic and character excellence.",
        keywords: "about us history philosophy leadership values executive board founder campus team message vision governors"
    },
    {
        url: "programs.html",
        title: "Academic Programs - Learning Alliance",
        badge: "Academics",
        description: "Explore our curriculum offerings, including Cambridge International O Level & A Level programmes, and International Baccalaureate (IB) PYP, MYP, and DP.",
        keywords: "programs academic academics curriculum cambridge o level a level international baccalaureate ib pyp myp dp classes subjects study course courses education"
    },
    {
        url: "student-policies.html",
        title: "Student Policies - Learning Alliance",
        badge: "Policies",
        description: "Access our student guidelines and policies, including code of conduct, academic honesty, attendance, uniform rules, and campus discipline.",
        keywords: "student policies rules code of conduct discipline attendance uniform academic honesty integrity guidelines regulations guidelines"
    },
    {
        url: "co-curricular.html",
        title: "Co-Curricular Activities - Learning Alliance",
        badge: "Activities",
        description: "Explore co-curricular opportunities at Learning Alliance. Learn about sports, music, drama, art festivals, science fairs, after-school clubs, and trips.",
        keywords: "co-curricular activities sports music drama art science fair clubs trips debates mun model united nations student clubs events activities"
    },
    {
        url: "admissions.html",
        title: "Admissions - Learning Alliance",
        badge: "Admissions",
        description: "Find comprehensive admissions information, including process timelines, fee structure, age criteria, and registration forms.",
        keywords: "admissions apply register admission process fees structure requirements age criteria guidelines registration form schedule cost"
    },
    {
        url: "life-at-la.html",
        title: "Life at LA - Learning Alliance",
        badge: "Campus Life",
        description: "Experience vibrant campus life at Learning Alliance. Meet our Student Council, explore school events, news & events, term dates, and view our facilities and photo gallery.",
        keywords: "life at la campus life student council events facilities achievements gallery photo gallery student activities societies news events term dates magazine yearbook"
    },
    {
        url: "contact-us.html",
        title: "Contact Us - Learning Alliance",
        badge: "Contact",
        description: "Get in touch with our branches in DHA, Aziz Avenue, Gulberg, and Faisalabad. Access maps, addresses, emails, and phone numbers.",
        keywords: "contact us address phone email map location branches dha aziz avenue locations gulberg faisalabad inquiry office support message query"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Find the sidebar menu navigation and inject the search form
    const menuNav = document.querySelector('.menu-nav');
    if (menuNav) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'menu-search-container';
        searchContainer.innerHTML = `
            <form id="menuSearchForm">
                <div class="search-input-wrapper">
                    <input type="text" id="menuSearchInput" placeholder="Search this site..." autocomplete="off" required>
                    <button type="submit" aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
                </div>
            </form>
        `;
        menuNav.appendChild(searchContainer);

        // Bind form submit event
        const searchForm = searchContainer.querySelector('#menuSearchForm');
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputVal = document.getElementById('menuSearchInput').value.trim();
            if (inputVal) {
                performSearch(inputVal);
            }
        });
    }

    // 2. Inject the search results modal structure into the body
    const searchModalHTML = `
        <div id="searchModal" class="search-modal">
            <div class="search-modal-content">
                <button id="closeSearchModal" class="close-search-btn" aria-label="Close search results">&times;</button>
                <h3 class="search-modal-title">Search Results</h3>
                <div class="search-modal-query-display">Results for: "<span id="searchQueryVal"></span>"</div>
                
                <div class="modal-search-box-wrapper">
                    <input type="text" id="modalSearchInput" placeholder="Search again..." autocomplete="off" required>
                    <button id="modalSearchBtn" aria-label="Search button"><i class="fa-solid fa-magnifying-glass"></i></button>
                </div>

                <div id="searchResultsList" class="search-results-list"></div>
            </div>
        </div>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = searchModalHTML.trim();
    const modalElement = div.firstChild;
    document.body.appendChild(modalElement);

    // Bind modal actions
    const closeBtn = modalElement.querySelector('#closeSearchModal');
    closeBtn.addEventListener('click', closeSearch);

    // Close on clicking outside the content box
    modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) {
            closeSearch();
        }
    });

    // Bind modal internal search box interactions
    const modalSearchInput = modalElement.querySelector('#modalSearchInput');
    const modalSearchBtn = modalElement.querySelector('#modalSearchBtn');

    modalSearchBtn.addEventListener('click', () => {
        const query = modalSearchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });

    modalSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = modalSearchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
});

/**
 * Executes the search algorithm, scores results, and updates the UI.
 * @param {string} query - The user search query.
 */
function performSearch(query) {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return;

    // Show query in display
    const queryDisplay = document.getElementById('searchQueryVal');
    if (queryDisplay) queryDisplay.textContent = query;
    
    // Synchronize both search input values
    const menuSearchInput = document.getElementById('menuSearchInput');
    const modalSearchInput = document.getElementById('modalSearchInput');
    if (menuSearchInput) menuSearchInput.value = query;
    if (modalSearchInput) modalSearchInput.value = query;

    // Close sidebar menu
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu) {
        sideMenu.classList.remove('active');
    }

    // Open search modal
    const searchModal = document.getElementById('searchModal');
    if (searchModal) {
        searchModal.classList.add('active');
        // Animate modal content if GSAP is available
        if (window.gsap) {
            gsap.fromTo('.search-modal-content', 
                { scale: 0.9, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
            );
        }
    }

    // Process Search Results
    const results = [];
    const searchTerms = trimmedQuery.split(/\s+/).filter(t => t.length > 0);

    searchIndex.forEach(item => {
        let score = 0;
        let matched = false;

        searchTerms.forEach(term => {
            const inTitle = item.title.toLowerCase().includes(term);
            const inDesc = item.description.toLowerCase().includes(term);
            const inKeywords = item.keywords.toLowerCase().includes(term);

            if (inTitle || inDesc || inKeywords) {
                matched = true;
                if (inTitle) score += 10;
                if (inKeywords) score += 5;
                if (inDesc) score += 2;
            }
        });

        if (matched) {
            results.push({ ...item, score });
        }
    });

    // Sort by score (highest match first)
    results.sort((a, b) => b.score - a.score);

    // Render results list
    const resultsContainer = document.getElementById('searchResultsList');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-face-frown mb-3" style="font-size: 40px; color: #bb2122;"></i>
                <p>No results found for "<strong>${escapeHtml(query)}</strong>".</p>
                <p style="font-size: 14px; color: #888; margin-top: 5px;">Try checking your spelling or using different keywords like "IB", "Admissions", "Sports", etc.</p>
            </div>
        `;
    } else {
        results.forEach(result => {
            const itemElement = document.createElement('div');
            itemElement.className = 'search-result-item';
            
            // Highlight match terms in title & description
            let highlightedTitle = escapeHtml(result.title);
            let highlightedDesc = escapeHtml(result.description);

            searchTerms.forEach(term => {
                const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
                highlightedTitle = highlightedTitle.replace(regex, '<mark>$1</mark>');
                highlightedDesc = highlightedDesc.replace(regex, '<mark>$1</mark>');
            });

            itemElement.innerHTML = `
                <a href="${result.url}" class="search-result-title">${highlightedTitle}</a>
                <p class="search-result-desc">${highlightedDesc}</p>
                <span class="search-result-badge badge-page">${result.badge}</span>
            `;
            resultsContainer.appendChild(itemElement);
        });
    }
}

/**
 * Closes the search modal.
 */
function closeSearch() {
    const searchModal = document.getElementById('searchModal');
    if (searchModal) {
        if (window.gsap) {
            gsap.to('.search-modal-content', {
                scale: 0.9,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    searchModal.classList.remove('active');
                }
            });
        } else {
            searchModal.classList.remove('active');
        }
    }
}

/**
 * Helper to escape HTML characters.
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * Helper to escape regex special characters.
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
