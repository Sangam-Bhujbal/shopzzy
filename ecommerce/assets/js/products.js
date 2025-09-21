// Product management functionality

class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.isLoading = false;

        this.init();
    }

    init() {
        this.loadProducts();
        this.setupInfiniteScroll();
        this.setupProductFilters();
    }

    async loadProducts(category = '', search = '') {
        this.isLoading = true;
        this.showLoading();

        try {
            // Simulate API call
            const products = await this.fetchProducts(category, search);
            this.products = products;
            this.filteredProducts = [...products];
            this.currentPage = 1;
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Failed to load products. Please try again.');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    async fetchProducts(category, search) {
        // Mock product data - in real app, this would be an API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockProducts = [
                    {
                        id: 1,
                        name: 'iPhone 14 Pro Max',
                        brand: 'Apple',
                        category: 'Electronics',
                        price: 129900,
                        originalPrice: 139900,
                        rating: 4.5,
                        reviews: 1250,
                        image: 'assets/images/products/iphone14.jpg',
                        images: ['assets/images/products/iphone14-1.jpg', 'assets/images/products/iphone14-2.jpg'],
                        description: 'Latest iPhone with advanced camera system and A16 Bionic chip.',
                        features: ['6.7-inch Super Retina XDR display', '48MP Main camera', 'A16 Bionic chip', 'Up to 29 hours video playback'],
                        inStock: true,
                        stockCount: 25,
                        discount: 7,
                        isNew: false,
                        isFeatured: true,
                        variants: [
                            { name: 'Color', options: ['Deep Purple', 'Gold', 'Silver', 'Space Black'] },
                            { name: 'Storage', options: ['128GB', '256GB', '512GB', '1TB'] }
                        ]
                    },
                    {
                        id: 2,
                        name: 'Samsung Galaxy S23 Ultra',
                        brand: 'Samsung',
                        category: 'Electronics',
                        price: 124999,
                        originalPrice: 124999,
                        rating: 4.7,
                        reviews: 890,
                        image: 'assets/images/products/galaxy-s23.jpg',
                        images: ['assets/images/products/galaxy-s23-1.jpg', 'assets/images/products/galaxy-s23-2.jpg'],
                        description: 'Premium Android smartphone with S Pen and professional cameras.',
                        features: ['6.8-inch Dynamic AMOLED 2X display', '200MP camera', 'Snapdragon 8 Gen 2', 'S Pen included'],
                        inStock: true,
                        stockCount: 18,
                        discount: 0,
                        isNew: true,
                        isFeatured: true,
                        variants: [
                            { name: 'Color', options: ['Phantom Black', 'Cream', 'Green', 'Lavender'] },
                            { name: 'Storage', options: ['256GB', '512GB', '1TB'] }
                        ]
                    },
                    {
                        id: 3,
                        name: 'MacBook Pro 14-inch',
                        brand: 'Apple',
                        category: 'Electronics',
                        price: 199900,
                        originalPrice: 199900,
                        rating: 4.8,
                        reviews: 567,
                        image: 'assets/images/products/macbook-pro.jpg',
                        images: ['assets/images/products/macbook-pro-1.jpg', 'assets/images/products/macbook-pro-2.jpg'],
                        description: 'Powerful laptop for professionals with M2 Pro chip.',
                        features: ['14.2-inch Liquid Retina XDR display', 'M2 Pro chip', 'Up to 18 hours battery', 'Three Thunderbolt 4 ports'],
                        inStock: true,
                        stockCount: 12,
                        discount: 0,
                        isNew: false,
                        isFeatured: true,
                        variants: [
                            { name: 'Chip', options: ['M2 Pro', 'M2 Max'] },
                            { name: 'Storage', options: ['512GB', '1TB', '2TB'] }
                        ]
                    },
                    {
                        id: 4,
                        name: 'Nike Air Max 270',
                        brand: 'Nike',
                        category: 'Fashion',
                        price: 12995,
                        originalPrice: 15995,
                        rating: 4.3,
                        reviews: 2340,
                        image: 'assets/images/products/nike-airmax.jpg',
                        images: ['assets/images/products/nike-airmax-1.jpg', 'assets/images/products/nike-airmax-2.jpg'],
                        description: 'Comfortable running shoes with maximum Air cushioning.',
                        features: ['Max Air unit', 'Breathable mesh upper', 'Foam midsole', 'Rubber outsole'],
                        inStock: true,
                        stockCount: 45,
                        discount: 19,
                        isNew: false,
                        isFeatured: false,
                        variants: [
                            { name: 'Size', options: ['6', '7', '8', '9', '10', '11'] },
                            { name: 'Color', options: ['Black', 'White', 'Red', 'Blue'] }
                        ]
                    },
                    {
                        id: 5,
                        name: 'Sony WH-1000XM5',
                        brand: 'Sony',
                        category: 'Electronics',
                        price: 29990,
                        originalPrice: 34990,
                        rating: 4.6,
                        reviews: 1890,
                        image: 'assets/images/products/sony-headphones.jpg',
                        images: ['assets/images/products/sony-headphones-1.jpg', 'assets/images/products/sony-headphones-2.jpg'],
                        description: 'Industry-leading noise canceling wireless headphones.',
                        features: ['30-hour battery life', 'Quick charge', 'Touch sensor controls', 'Speak-to-Chat technology'],
                        inStock: true,
                        stockCount: 30,
                        discount: 14,
                        isNew: true,
                        isFeatured: true,
                        variants: [
                            { name: 'Color', options: ['Black', 'Silver', 'Blue'] }
                        ]
                    },
                    {
                        id: 6,
                        name: 'Dyson V15 Detect',
                        brand: 'Dyson',
                        category: 'Home',
                        price: 65900,
                        originalPrice: 65900,
                        rating: 4.4,
                        reviews: 445,
                        image: 'assets/images/products/dyson-vacuum.jpg',
                        images: ['assets/images/products/dyson-vacuum-1.jpg', 'assets/images/products/dyson-vacuum-2.jpg'],
                        description: 'Powerful cordless vacuum with laser dust detection.',
                        features: ['Laser dust detection', '60 minutes run time', 'Whole-machine filtration', 'LCD screen'],
                        inStock: true,
                        stockCount: 8,
                        discount: 0,
                        isNew: false,
                        isFeatured: false,
                        variants: [
                            { name: 'Model', options: ['V15 Detect'] }
                        ]
                    }
                ];

                // Filter by category if specified
                let filtered = mockProducts;
                if (category) {
                    filtered = mockProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
                }

                // Filter by search term if specified
                if (search) {
                    filtered = filtered.filter(p =>
                        p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.brand.toLowerCase().includes(search.toLowerCase()) ||
                        p.description.toLowerCase().includes(search.toLowerCase())
                    );
                }

                resolve(filtered);
            }, 500);
        });
    }

    renderProducts() {
        const container = document.getElementById('products-container') ||
                         document.getElementById('trending-products') ||
                         document.getElementById('flash-products');

        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            container.innerHTML = this.getEmptyState();
            return;
        }

        const productsHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        container.innerHTML = productsHTML;

        // Setup product interactions
        this.setupProductInteractions();
    }

    createProductCard(product) {
        const discountBadge = product.discount > 0 ? `<div class="badge badge-sale">${product.discount}% OFF</div>` : '';
        const newBadge = product.isNew ? '<div class="badge badge-new">NEW</div>' : '';
        const featuredBadge = product.isFeatured ? '<div class="badge badge-featured">FEATURED</div>' : '';

        const wishlistIcon = window.wishlist?.isInWishlist(product.id) ? 'fas fa-heart' : 'far fa-heart';

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    ${discountBadge}
                    ${newBadge}
                    ${featuredBadge}
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <button class="product-wishlist" onclick="toggleWishlist(${product.id}, this)" aria-label="Add to wishlist">
                        <i class="${wishlistIcon}"></i>
                    </button>
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.brand}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="price-current">₹${product.price.toLocaleString()}</span>
                        ${product.originalPrice > product.price ? `<span class="price-original">₹${product.originalPrice.toLocaleString()}</span>` : ''}
                        ${product.discount > 0 ? `<span class="price-discount">${product.discount}% off</span>` : ''}
                    </div>
                    <div class="product-rating">
                        <div class="rating-stars">
                            ${this.generateStars(product.rating)}
                        </div>
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">
                            Add to Cart
                        </button>
                        <button class="btn-quick-view" onclick="showProductModal(${product.id})" aria-label="Quick view">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    setupProductInteractions() {
        // Add to cart buttons
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = btn.closest('.product-card');
                const productId = parseInt(productCard.dataset.productId);

                const product = this.filteredProducts.find(p => p.id === productId);
                if (product) {
                    window.cart.addItem(product.id, product.name, product.price, product.image);
                }
            });
        });

        // Wishlist buttons
        document.querySelectorAll('.product-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = btn.closest('.product-card');
                const productId = parseInt(productCard.dataset.productId);

                if (window.wishlist) {
                    window.toggleWishlist(productId, btn);
                }
            });
        });
    }

    setupInfiniteScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isLoading) {
                    const sentinel = entry.target;
                    if (sentinel.id === 'products-sentinel') {
                        this.loadMoreProducts();
                    }
                }
            });
        }, { threshold: 0.1 });

        // Add sentinel element
        const sentinel = document.createElement('div');
        sentinel.id = 'products-sentinel';
        sentinel.style.height = '20px';

        document.body.appendChild(sentinel);
        observer.observe(sentinel);
    }

    async loadMoreProducts() {
        if (this.isLoading) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        if (this.currentPage >= totalPages) return;

        this.currentPage++;
        this.renderProducts();
    }

    setupProductFilters() {
        // Price range slider
        const priceRange = document.getElementById('price-range');
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');

        if (priceRange && priceMin && priceMax) {
            priceRange.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                priceMax.value = value;
                this.filterByPrice(0, value);
            });
        }

        // Sort options
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }
    }

    filterByPrice(min, max) {
        this.filteredProducts = this.products.filter(product =>
            product.price >= min && product.price <= max
        );
        this.currentPage = 1;
        this.renderProducts();
    }

    filterByCategory(category) {
        if (category === 'all') {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product =>
                product.category.toLowerCase() === category.toLowerCase()
            );
        }
        this.currentPage = 1;
        this.renderProducts();
    }

    sortProducts(sortBy) {
        switch (sortBy) {
            case 'price_low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price_high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            default:
                this.filteredProducts = [...this.products];
        }
        this.currentPage = 1;
        this.renderProducts();
    }

    showLoading() {
        const containers = ['products-container', 'trending-products', 'flash-products'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
            }
        });
    }

    hideLoading() {
        // Loading state is handled by renderProducts
    }

    showError(message) {
        const containers = ['products-container', 'trending-products', 'flash-products'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `<div class="error-message">${message}</div>`;
            }
        });
    }

    getEmptyState() {
        return `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button class="btn btn-primary" onclick="productManager.resetFilters()">
                    Reset Filters
                </button>
            </div>
        `;
    }

    resetFilters() {
        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.renderProducts();

        // Reset form elements
        const filters = document.querySelectorAll('#price-range, #sort-select, #category-filter');
        filters.forEach(filter => {
            if (filter.tagName === 'SELECT') {
                filter.selectedIndex = 0;
            } else {
                filter.value = filter.max || filter.defaultValue;
            }
        });
    }

    // Public methods
    getProduct(id) {
        return this.products.find(p => p.id === parseInt(id));
    }

    searchProducts(query) {
        this.loadProducts('', query);
    }
}

// Product modal functionality
class ProductModal {
    constructor() {
        this.modal = null;
        this.currentProduct = null;
        this.init();
    }

    init() {
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.id = 'product-modal';
        this.modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" id="product-modal-title">Product Details</h2>
                    <button class="modal-close" aria-label="Close modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" id="product-modal-body">
                    <!-- Product details will be inserted here -->
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
    }

    setupEventListeners() {
        // Close modal events
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.hide());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.hide();
            }
        });
    }

    show(productId) {
        const product = window.productManager?.getProduct(productId);
        if (!product) return;

        this.currentProduct = product;
        this.renderProductDetails(product);
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus management
        const focusableElements = this.modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    hide() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentProduct = null;
    }

    renderProductDetails(product) {
        const modalBody = this.modal.querySelector('#product-modal-body');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="product-modal-content">
                <div class="product-modal-images">
                    <div class="main-image">
                        <img src="${product.image}" alt="${product.name}" id="main-product-image">
                    </div>
                    <div class="thumbnail-images">
                        ${product.images.map((image, index) => `
                            <img src="${image}" alt="${product.name}" class="thumbnail ${index === 0 ? 'active' : ''}"
                                 onclick="productModal.showImage(${index})">
                        `).join('')}
                    </div>
                </div>
                <div class="product-modal-info">
                    <h1>${product.name}</h1>
                    <div class="product-meta">
                        <span class="brand">by ${product.brand}</span>
                        <div class="rating">
                            <div class="rating-stars">
                                ${window.productManager?.generateStars(product.rating) || ''}
                            </div>
                            <span class="rating-count">${product.rating} (${product.reviews} reviews)</span>
                        </div>
                    </div>
                    <div class="product-price">
                        <span class="price-current">₹${product.price.toLocaleString()}</span>
                        ${product.originalPrice > product.price ?
                            `<span class="price-original">₹${product.originalPrice.toLocaleString()}</span>` : ''}
                        ${product.discount > 0 ? `<span class="price-discount">${product.discount}% off</span>` : ''}
                    </div>
                    <div class="product-description">
                        <p>${product.description}</p>
                    </div>
                    <div class="product-features">
                        <h3>Key Features:</h3>
                        <ul>
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="product-variants">
                        ${product.variants.map(variant => `
                            <div class="variant-group">
                                <label>${variant.name}:</label>
                                <select class="variant-select" data-variant="${variant.name.toLowerCase()}">
                                    ${variant.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                                </select>
                            </div>
                        `).join('')}
                    </div>
                    <div class="product-stock">
                        <span class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                            <i class="fas ${product.inStock ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                            ${product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
                        </span>
                    </div>
                    <div class="product-actions">
                        <div class="quantity-selector">
                            <label>Quantity:</label>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="productModal.updateQuantity(-1)">-</button>
                                <input type="number" value="1" min="1" max="${product.stockCount}" id="product-quantity">
                                <button class="quantity-btn" onclick="productModal.updateQuantity(1)">+</button>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-add-to-cart" onclick="productModal.addToCart()">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="btn btn-outline" onclick="toggleWishlist(${product.id}, this)">
                            <i class="far fa-heart"></i>
                            Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showImage(index) {
        const product = this.currentProduct;
        if (!product || !product.images[index]) return;

        const mainImage = document.getElementById('main-product-image');
        const thumbnails = document.querySelectorAll('.thumbnail');

        if (mainImage) {
            mainImage.src = product.images[index];
        }

        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    updateQuantity(change) {
        const quantityInput = document.getElementById('product-quantity');
        if (!quantityInput) return;

        let newQuantity = parseInt(quantityInput.value) + change;
        const maxQuantity = this.currentProduct?.stockCount || 1;

        newQuantity = Math.max(1, Math.min(newQuantity, maxQuantity));
        quantityInput.value = newQuantity;
    }

    addToCart() {
        const product = this.currentProduct;
        const quantity = parseInt(document.getElementById('product-quantity')?.value) || 1;

        if (product && window.cart) {
            for (let i = 0; i < quantity; i++) {
                window.cart.addItem(product.id, product.name, product.price, product.image);
            }
            this.hide();
        }
    }
}

// Initialize product functionality
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
    window.productModal = new ProductModal();

    // Load trending products on homepage
    const trendingContainer = document.getElementById('trending-products');
    if (trendingContainer) {
        window.productManager.loadProducts();
    }

    // Load flash sale products
    const flashContainer = document.getElementById('flash-products');
    if (flashContainer) {
        window.productManager.loadProducts();
    }
});

// Global functions
function showProductModal(productId) {
    if (window.productModal) {
        window.productModal.show(productId);
    }
}

// Export for use in other modules
window.ProductManager = ProductManager;
window.ProductModal = ProductModal;
