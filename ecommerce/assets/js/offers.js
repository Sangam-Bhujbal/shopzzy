document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timers
    initializeBannerCountdown();
    initializeOfferCountdowns();
    initializeFilters();
    initializeCopyButtons();
    initializeTermsModals();
});

// Banner Countdown
function initializeBannerCountdown() {
    const bannerCountdown = document.querySelector('.banner-countdown');
    if (!bannerCountdown) return;

    const endDate = new Date(bannerCountdown.dataset.end);
    
    function updateBannerCountdown() {
        const now = new Date();
        const distance = endDate - now;

        if (distance < 0) {
            bannerCountdown.innerHTML = 'Offer Expired';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        bannerCountdown.querySelector('.days').textContent = String(days).padStart(2, '0');
        bannerCountdown.querySelector('.hours').textContent = String(hours).padStart(2, '0');
        bannerCountdown.querySelector('.minutes').textContent = String(minutes).padStart(2, '0');
        bannerCountdown.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateBannerCountdown();
    setInterval(updateBannerCountdown, 1000);
}

// Individual Offer Countdowns
function initializeOfferCountdowns() {
    const countdowns = document.querySelectorAll('.countdown');
    
    countdowns.forEach(countdown => {
        const endDate = new Date(countdown.dataset.end);
        
        function updateCountdown() {
            const now = new Date();
            const distance = endDate - now;

            if (distance < 0) {
                countdown.textContent = 'Expired';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            if (days > 0) {
                countdown.textContent = `${days} days`;
            } else if (hours > 0) {
                countdown.textContent = `${hours} hours`;
            } else {
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                countdown.textContent = `${minutes} minutes`;
            }
        }

        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
    });
}

// Offer Filters
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const offers = document.querySelectorAll('.offer-card');
    const searchInput = document.querySelector('.offers-search-input');
    const validityFilter = document.querySelector('#validity-filter');

    // Category Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            offers.forEach(offer => {
                if (category === 'all' || offer.dataset.category === category) {
                    offer.style.display = 'flex';
                } else {
                    offer.style.display = 'none';
                }
            });
        });
    });

    // Search Functionality
    if (searchInput) {
        searchInput.addEventListener('input', filterOffers);
    }

    // Validity Filtering
    if (validityFilter) {
        validityFilter.addEventListener('change', filterOffers);
    }

    function filterOffers() {
        const searchTerm = searchInput.value.toLowerCase();
        const validityValue = validityFilter.value;

        offers.forEach(offer => {
            const title = offer.querySelector('h3').textContent.toLowerCase();
            const description = offer.querySelector('p').textContent.toLowerCase();
            const validity = offer.querySelector('.offer-validity').textContent.toLowerCase();
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            let matchesValidity = true;

            // Validity filtering logic
            if (validityValue !== 'all') {
                const validityDate = new Date(offer.querySelector('.countdown')?.dataset.end || 
                                           validity.match(/\d{1,2}\s+\w+\s+\d{4}/)[0]);
                const now = new Date();
                const daysUntilExpiry = Math.floor((validityDate - now) / (1000 * 60 * 60 * 24));

                switch (validityValue) {
                    case 'active':
                        matchesValidity = daysUntilExpiry > 0;
                        break;
                    case 'ending-soon':
                        matchesValidity = daysUntilExpiry > 0 && daysUntilExpiry <= 7;
                        break;
                    case 'upcoming':
                        matchesValidity = daysUntilExpiry > 7;
                        break;
                }
            }

            offer.style.display = matchesSearch && matchesValidity ? 'flex' : 'none';
        });
    }
}

// Copy Coupon Code
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-code-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const code = button.dataset.code;
            navigator.clipboard.writeText(code).then(() => {
                // Change button icon temporarily
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.color = 'var(--success-color)';
                
                // Show toast notification
                showToast('Coupon code copied!');
                
                // Revert button after 2 seconds
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.color = '';
                }, 2000);
            });
        });
    });
}

// Terms and Conditions Modals
function initializeTermsModals() {
    const termsButtons = document.querySelectorAll('.btn-terms');
    const closeButtons = document.querySelectorAll('.close-terms');
    const modals = document.querySelectorAll('.terms-modal');

    termsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.terms;
            const modal = document.getElementById(modalId);
            modal.style.display = 'flex';
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.terms-modal');
            modal.style.display = 'none';
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger reflow for animation
    toast.offsetHeight;
    
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// Add Toast styles to the page
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        background-color: var(--bg-color);
        color: var(--text-color);
        padding: 12px 24px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
`;
document.head.appendChild(style);