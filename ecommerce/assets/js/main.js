// Main JavaScript functionality for E-Commerce Store

class ECommerceApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.checkDarkMode();
        this.setupScrollToTop();
        this.setupOfflineDetection();
    }

    setupEventListeners() {
        // Dark mode toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }

        // Account dropdown
        const accountBtn = document.getElementById('account-btn');
        const accountDropdown = document.getElementById('account-dropdown');
        if (accountBtn && accountDropdown) {
            accountBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(accountDropdown);
            });

            document.addEventListener('click', () => {
                this.closeDropdown(accountDropdown);
            });
        }

        // Categories dropdown
        const categoriesBtn = document.getElementById('categories-btn');
        const categoriesDropdown = document.getElementById('categories-dropdown');
        if (categoriesBtn && categoriesDropdown) {
            categoriesBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(categoriesDropdown);
            });

            document.addEventListener('click', () => {
                this.closeDropdown(categoriesDropdown);
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }

        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(searchInput.value);
                }
            });
        }
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch(searchInput.value));
        }

        // Mobile menu toggle
        this.setupMobileMenu();
    }

    initializeComponents() {
        // Initialize carousel if present
        if (document.querySelector('.carousel')) {
            this.initializeCarousel();
        }

        // Initialize tooltips
        this.initializeTooltips();

        // Initialize lazy loading
        this.initializeLazyLoading();
    }

    toggleDarkMode() {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';

        if (isDark) {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }

        // Update toggle icon
        const toggle = document.getElementById('dark-mode-toggle');
        if (toggle) {
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    }

    checkDarkMode() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            const toggle = document.getElementById('dark-mode-toggle');
            if (toggle) {
                const icon = toggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-sun';
                }
            }
        }
    }

    toggleDropdown(dropdown) {
        const isActive = dropdown.classList.contains('active');

        // Close all dropdowns first
        document.querySelectorAll('.dropdown-menu, .categories-dropdown, .account-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });

        if (!isActive) {
            dropdown.classList.add('active');
        }
    }

    closeDropdown(dropdown) {
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;

        if (this.validateEmail(email)) {
            // Simulate newsletter subscription
            this.showAlert('Successfully subscribed to newsletter!', 'success');

            // Store subscription (in real app, send to server)
            const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
            subscriptions.push({ email, date: new Date().toISOString() });
            localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));

            form.reset();
        } else {
            this.showAlert('Please enter a valid email address.', 'error');
        }
    }

    handleSearch(e) {
        const query = e.target.value.trim();
        const suggestionsContainer = document.getElementById('search-suggestions');

        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        // Simulate search suggestions
        const suggestions = this.getSearchSuggestions(query);
        this.displaySearchSuggestions(suggestions);
    }

    getSearchSuggestions(query) {
        // Mock product suggestions
        const products = [
            'iPhone 14', 'Samsung Galaxy S23', 'MacBook Pro', 'Dell Laptop',
            'Nike Shoes', 'Adidas T-shirt', 'Home Decor', 'Kitchen Appliances',
            'Books', 'Gaming Console', 'Headphones', 'Smart Watch'
        ];

        return products.filter(product =>
            product.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }

    displaySearchSuggestions(suggestions) {
        const container = document.getElementById('search-suggestions');

        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = suggestions.map(suggestion => `
            <div class="search-suggestion" onclick="app.performSearch('${suggestion}')">
                <i class="fas fa-search"></i>
                <span>${suggestion}</span>
            </div>
        `).join('');

        container.style.display = 'block';
    }

    performSearch(query) {
        if (query.trim()) {
            // In a real app, redirect to search results page
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }

    setupMobileMenu() {
        // Add mobile menu toggle if screen is small
        if (window.innerWidth <= 768) {
            const nav = document.querySelector('.main-nav');
            const navMenu = document.querySelector('.nav-menu');

            if (nav && navMenu) {
                const toggle = document.createElement('button');
                toggle.className = 'mobile-menu-toggle';
                toggle.innerHTML = '<i class="fas fa-bars"></i>';
                toggle.setAttribute('aria-label', 'Toggle mobile menu');

                toggle.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                    const icon = toggle.querySelector('i');
                    icon.className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
                });

                nav.querySelector('.nav-content').insertBefore(toggle, navMenu);
            }
        }
    }

    initializeCarousel() {
        const carousel = document.getElementById('hero-carousel');
        const slides = carousel?.querySelectorAll('.carousel-slide');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const indicators = document.querySelectorAll('.indicator');

        if (!carousel || !slides || slides.length === 0) return;

        let currentSlide = 0;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
                indicators[i]?.classList.toggle('active', i === index);
            });
            currentSlide = index;
        };

        const nextSlide = () => {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        };

        const prevSlide = () => {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev);
        };

        // Auto-advance carousel
        setInterval(nextSlide, 5000);

        // Event listeners
        prevBtn?.addEventListener('click', prevSlide);
        nextBtn?.addEventListener('click', nextSlide);

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => showSlide(index));
        });
    }

    initializeTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');

        tooltips.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.getAttribute('data-tooltip'));
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');

            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    setupScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollBtn);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupOfflineDetection() {
        const indicator = document.createElement('div');
        indicator.className = 'offline-indicator';
        indicator.textContent = 'You are currently offline';
        document.body.appendChild(indicator);

        window.addEventListener('online', () => {
            indicator.classList.remove('show');
            this.showAlert('Connection restored!', 'success');
        });

        window.addEventListener('offline', () => {
            indicator.classList.add('show');
            this.showAlert('You are offline. Some features may not work.', 'warning');
        });
    }

    showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.className = 'alert-close';
        closeBtn.addEventListener('click', () => alert.remove());

        alert.appendChild(closeBtn);
        document.body.appendChild(alert);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);

        // Animate in
        requestAnimationFrame(() => {
            alert.classList.add('fade-in');
        });
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Cart functionality
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartDisplay();
    }

    addItem(productId, name, price, image, quantity = 1) {
        const existingItem = this.items.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                name,
                price,
                image,
                quantity
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        app.showAlert(`${name} added to cart!`, 'success');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const count = this.getItemCount();

        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'block' : 'none';
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }
}

// Wishlist functionality
class Wishlist {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('wishlist')) || [];
    }

    addItem(productId) {
        if (!this.items.includes(productId)) {
            this.items.push(productId);
            this.saveWishlist();
            app.showAlert('Added to wishlist!', 'success');
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(id => id !== productId);
        this.saveWishlist();
    }

    isInWishlist(productId) {
        return this.items.includes(productId);
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.items));
    }
}

// Initialize the application
const app = new ECommerceApp();
const cart = new Cart();
const wishlist = new Wishlist();

// Global functions for HTML onclick handlers
function addToCart(productId, name, price, image) {
    cart.addItem(productId, name, price, image);
}

function toggleWishlist(productId, button) {
    if (wishlist.isInWishlist(productId)) {
        wishlist.removeItem(productId);
        button.classList.remove('active');
    } else {
        wishlist.addItem(productId);
        button.classList.add('active');
    }
}

// Export for use in other modules
window.ECommerceApp = ECommerceApp;
window.app = app;
window.cart = cart;
window.wishlist = wishlist;
