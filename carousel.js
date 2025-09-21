// Carousel functionality for hero banners

class HeroCarousel {
    constructor(selector = '.carousel') {
        this.carousel = document.querySelector(selector);
        if (!this.carousel) return;

        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.indicators = this.carousel.querySelectorAll('.indicator');
        this.prevBtn = this.carousel.querySelector('.prev');
        this.nextBtn = this.carousel.querySelector('.next');

        this.currentSlide = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 seconds
        this.isTransitioning = false;

        this.init();
    }

    init() {
        if (this.slides.length <= 1) return;

        this.setupEventListeners();
        this.startAutoplay();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
        this.setupIntersectionObserver();
    }

    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause autoplay on hover
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());

        // Handle visibility change (pause when tab is not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.startAutoplay();
            }
        });
    }

    setupKeyboardNavigation() {
        this.carousel.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.slides.length - 1);
                    break;
            }
        });

        // Make carousel focusable
        this.carousel.setAttribute('tabindex', '0');
        this.carousel.setAttribute('role', 'region');
        this.carousel.setAttribute('aria-label', 'Product carousel');
    }

    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        let isScrolling = null;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = null;
            this.pauseAutoplay();
        }, { passive: true });

        this.carousel.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;

            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            if (isScrolling === null) {
                isScrolling = Math.abs(diffX) < Math.abs(diffY);
            }

            if (!isScrolling) {
                e.preventDefault();
            }
        }, { passive: false });

        this.carousel.addEventListener('touchend', () => {
            if (!startX || !endX || isScrolling) {
                this.startAutoplay();
                return;
            }

            const diffX = startX - endX;
            const threshold = 50;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }

            startX = 0;
            startY = 0;
            this.startAutoplay();
        }, { passive: true });
    }

    setupIntersectionObserver() {
        // Pause autoplay when carousel is not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startAutoplay();
                } else {
                    this.pauseAutoplay();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.carousel);
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;

        this.isTransitioning = true;

        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide]?.classList.remove('active');

        // Set new current slide
        this.currentSlide = index;

        // Add active class to new slide
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide]?.classList.add('active');

        // Update ARIA attributes
        this.slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', i !== this.currentSlide);
        });

        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoplay() {
        if (this.slides.length <= 1) return;

        this.pauseAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    // Public methods for external control
    play() {
        this.startAutoplay();
    }

    pause() {
        this.pauseAutoplay();
    }

    goToNext() {
        this.nextSlide();
    }

    goToPrevious() {
        this.previousSlide();
    }

    goToSpecific(index) {
        if (index >= 0 && index < this.slides.length) {
            this.goToSlide(index);
        }
    }

    setAutoplayDelay(delay) {
        this.autoplayDelay = delay;
        if (this.autoplayInterval) {
            this.startAutoplay();
        }
    }

    destroy() {
        this.pauseAutoplay();
        // Remove event listeners
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', () => this.previousSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', () => this.nextSlide());
        }
    }
}

// Auto-initialize carousels
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel, index) => {
        // Add unique ID if not present
        if (!carousel.id) {
            carousel.id = `carousel-${index + 1}`;
        }

        new HeroCarousel(`#${carousel.id}`);
    });
});

// Export for use in other modules
window.HeroCarousel = HeroCarousel;
