// Search functionality with autocomplete and filters

class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchSuggestions = document.getElementById('search-suggestions');
        this.searchBtn = document.getElementById('search-btn');

        this.suggestions = [];
        this.recentSearches = JSON.parse(localStorage.getItem('recent_searches')) || [];
        this.popularSearches = [
            'iPhone 14', 'Samsung Galaxy', 'MacBook Pro', 'Nike Shoes',
            'Headphones', 'Smart Watch', 'Gaming Laptop', 'Wireless Earbuds',
            'Home Decor', 'Kitchen Appliances', 'Books', 'Fashion'
        ];

        this.debounceTimer = null;
        this.cache = new Map();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadRecentSearches();
    }

    setupEventListeners() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleInput(e.target.value);
            });

            this.searchInput.addEventListener('keydown', (e) => {
                this.handleKeydown(e);
            });

            this.searchInput.addEventListener('focus', () => {
                this.showSuggestions();
            });

            this.searchInput.addEventListener('blur', () => {
                // Delay hiding to allow clicks on suggestions
                setTimeout(() => {
                    this.hideSuggestions();
                }, 200);
            });
        }

        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => {
                this.performSearch(this.searchInput.value);
            });
        }

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });
    }

    handleInput(query) {
        clearTimeout(this.debounceTimer);

        if (query.length < 2) {
            this.showSuggestions();
            return;
        }

        this.debounceTimer = setTimeout(() => {
            this.fetchSuggestions(query);
        }, 300);
    }

    handleKeydown(e) {
        const suggestions = this.searchSuggestions.querySelectorAll('.search-suggestion');
        const activeSuggestion = this.searchSuggestions.querySelector('.search-suggestion.active');

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.navigateSuggestions(suggestions, activeSuggestion, 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateSuggestions(suggestions, activeSuggestion, -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (activeSuggestion) {
                    this.selectSuggestion(activeSuggestion);
                } else {
                    this.performSearch(this.searchInput.value);
                }
                break;
            case 'Escape':
                this.hideSuggestions();
                this.searchInput.blur();
                break;
        }
    }

    navigateSuggestions(suggestions, activeSuggestion, direction) {
        if (suggestions.length === 0) return;

        let newIndex = 0;

        if (activeSuggestion) {
            const currentIndex = Array.from(suggestions).indexOf(activeSuggestion);
            newIndex = currentIndex + direction;

            activeSuggestion.classList.remove('active');
        }

        if (newIndex < 0) {
            newIndex = suggestions.length - 1;
        } else if (newIndex >= suggestions.length) {
            newIndex = 0;
        }

        suggestions[newIndex].classList.add('active');
        this.searchInput.value = suggestions[newIndex].textContent.trim();
    }

    async fetchSuggestions(query) {
        // Check cache first
        const cacheKey = query.toLowerCase();
        if (this.cache.has(cacheKey)) {
            this.displaySuggestions(this.cache.get(cacheKey));
            return;
        }

        try {
            // Simulate API call - in real app, this would be an actual API request
            const suggestions = await this.mockSearchAPI(query);
            this.cache.set(cacheKey, suggestions);
            this.displaySuggestions(suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            this.displaySuggestions([]);
        }
    }

    mockSearchAPI(query) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockResults = [
                    'iPhone 14 Pro Max',
                    'iPhone 14 Pro',
                    'iPhone 14 Plus',
                    'iPhone 14',
                    'Samsung Galaxy S23 Ultra',
                    'Samsung Galaxy S23+',
                    'Samsung Galaxy S23',
                    'MacBook Pro 14 inch',
                    'MacBook Pro 16 inch',
                    'MacBook Air M2',
                    'Nike Air Max 270',
                    'Nike Air Force 1',
                    'Adidas Ultraboost 22',
                    'Sony WH-1000XM5',
                    'Apple AirPods Pro 2',
                    'Samsung Galaxy Buds2 Pro'
                ];

                const filtered = mockResults.filter(item =>
                    item.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 8);

                resolve(filtered);
            }, 200);
        });
    }

    displaySuggestions(suggestions) {
        if (!this.searchSuggestions) return;

        if (suggestions.length === 0) {
            this.searchSuggestions.innerHTML = `
                <div class="search-suggestion no-results">
                    <i class="fas fa-search"></i>
                    <span>No suggestions found</span>
                </div>
            `;
            this.searchSuggestions.style.display = 'block';
            return;
        }

        const suggestionsHTML = suggestions.map((suggestion, index) => `
            <div class="search-suggestion" data-index="${index}">
                <i class="fas fa-search"></i>
                <span>${this.highlightQuery(suggestion, this.searchInput.value)}</span>
            </div>
        `).join('');

        this.searchSuggestions.innerHTML = suggestionsHTML;
        this.searchSuggestions.style.display = 'block';

        // Add click handlers to suggestions
        this.searchSuggestions.querySelectorAll('.search-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                this.selectSuggestion(suggestion);
            });
        });
    }

    highlightQuery(text, query) {
        if (!query) return text;

        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    selectSuggestion(suggestionElement) {
        const text = suggestionElement.textContent.trim();
        this.searchInput.value = text;
        this.hideSuggestions();
        this.performSearch(text);
    }

    showSuggestions() {
        if (!this.searchSuggestions) return;

        let suggestions = [];

        if (this.searchInput.value.length < 2) {
            // Show recent searches and popular searches
            if (this.recentSearches.length > 0) {
                suggestions.push({
                    type: 'recent',
                    title: 'Recent Searches',
                    items: this.recentSearches.slice(0, 3)
                });
            }

            suggestions.push({
                type: 'popular',
                title: 'Popular Searches',
                items: this.popularSearches.slice(0, 5)
            });
        }

        this.displayGroupedSuggestions(suggestions);
    }

    displayGroupedSuggestions(suggestionGroups) {
        if (!this.searchSuggestions) return;

        const html = suggestionGroups.map(group => `
            <div class="suggestion-group">
                <div class="suggestion-group-title">${group.title}</div>
                ${group.items.map(item => `
                    <div class="search-suggestion" data-type="${group.type}">
                        <i class="fas fa-history"></i>
                        <span>${item}</span>
                    </div>
                `).join('')}
            </div>
        `).join('');

        this.searchSuggestions.innerHTML = html;
        this.searchSuggestions.style.display = 'block';

        // Add click handlers
        this.searchSuggestions.querySelectorAll('.search-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                const text = suggestion.textContent.trim();
                this.searchInput.value = text;
                this.hideSuggestions();
                this.performSearch(text);
            });
        });
    }

    performSearch(query) {
        if (!query.trim()) return;

        // Add to recent searches
        this.addToRecentSearches(query);

        // In a real application, redirect to search results page
        const searchParams = new URLSearchParams({
            q: query,
            timestamp: Date.now()
        });

        window.location.href = `search.html?${searchParams.toString()}`;
    }

    addToRecentSearches(query) {
        // Remove if already exists
        this.recentSearches = this.recentSearches.filter(item => item !== query);

        // Add to beginning
        this.recentSearches.unshift(query);

        // Keep only last 10 searches
        this.recentSearches = this.recentSearches.slice(0, 10);

        // Save to localStorage
        localStorage.setItem('recent_searches', JSON.stringify(this.recentSearches));

        this.loadRecentSearches();
    }

    loadRecentSearches() {
        // This method can be used to refresh recent searches from storage
        this.recentSearches = JSON.parse(localStorage.getItem('recent_searches')) || [];
    }

    hideSuggestions() {
        if (this.searchSuggestions) {
            this.searchSuggestions.style.display = 'none';
        }
    }

    clearRecentSearches() {
        this.recentSearches = [];
        localStorage.removeItem('recent_searches');
        this.showSuggestions();
    }

    // Public methods
    setSuggestions(suggestions) {
        this.suggestions = suggestions;
    }

    addSuggestion(suggestion) {
        if (!this.suggestions.includes(suggestion)) {
            this.suggestions.push(suggestion);
        }
    }

    removeSuggestion(suggestion) {
        this.suggestions = this.suggestions.filter(s => s !== suggestion);
    }

    clearCache() {
        this.cache.clear();
    }
}

// Advanced search with filters
class AdvancedSearch {
    constructor() {
        this.filters = {
            category: '',
            priceRange: { min: 0, max: 100000 },
            brand: '',
            rating: 0,
            availability: 'all'
        };

        this.sortOptions = {
            relevance: 'Relevance',
            price_low: 'Price: Low to High',
            price_high: 'Price: High to Low',
            rating: 'Customer Rating',
            newest: 'Newest First'
        };

        this.init();
    }

    init() {
        this.setupFilterListeners();
        this.setupSortListener();
    }

    setupFilterListeners() {
        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.applyFilters();
            });
        }

        // Price range filter
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const priceRange = document.getElementById('price-range');

        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.filters.priceRange.max = value;
                if (priceMax) priceMax.value = value;
                this.applyFilters();
            });
        }

        // Brand filter
        const brandFilter = document.getElementById('brand-filter');
        if (brandFilter) {
            brandFilter.addEventListener('change', (e) => {
                this.filters.brand = e.target.value;
                this.applyFilters();
            });
        }

        // Rating filter
        const ratingFilter = document.getElementById('rating-filter');
        if (ratingFilter) {
            ratingFilter.addEventListener('change', (e) => {
                this.filters.rating = parseInt(e.target.value);
                this.applyFilters();
            });
        }

        // Availability filter
        const availabilityFilter = document.getElementById('availability-filter');
        if (availabilityFilter) {
            availabilityFilter.addEventListener('change', (e) => {
                this.filters.availability = e.target.value;
                this.applyFilters();
            });
        }
    }

    setupSortListener() {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortResults(e.target.value);
            });
        }
    }

    applyFilters() {
        // In a real application, this would make an API call
        console.log('Applying filters:', this.filters);

        // Trigger search results update
        this.updateSearchResults();
    }

    sortResults(sortBy) {
        console.log('Sorting by:', sortBy);
        this.updateSearchResults();
    }

    updateSearchResults() {
        // Mock implementation - in real app, this would update the results display
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.classList.add('loading');

            // Simulate API delay
            setTimeout(() => {
                resultsContainer.classList.remove('loading');
                // Update results display
            }, 500);
        }
    }

    resetFilters() {
        this.filters = {
            category: '',
            priceRange: { min: 0, max: 100000 },
            brand: '',
            rating: 0,
            availability: 'all'
        };

        // Reset form elements
        const form = document.getElementById('search-filters-form');
        if (form) {
            form.reset();
        }

        this.applyFilters();
    }

    getFilterSummary() {
        const activeFilters = [];

        if (this.filters.category) {
            activeFilters.push(`Category: ${this.filters.category}`);
        }

        if (this.filters.brand) {
            activeFilters.push(`Brand: ${this.filters.brand}`);
        }

        if (this.filters.rating > 0) {
            activeFilters.push(`Rating: ${this.filters.rating}+ stars`);
        }

        if (this.filters.availability !== 'all') {
            activeFilters.push(`Availability: ${this.filters.availability}`);
        }

        return activeFilters;
    }
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', () => {
    window.searchManager = new SearchManager();
    window.advancedSearch = new AdvancedSearch();
});

// Export for use in other modules
window.SearchManager = SearchManager;
window.AdvancedSearch = AdvancedSearch;
