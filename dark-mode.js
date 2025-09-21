// Dark mode functionality with system preference detection

class DarkModeManager {
    constructor() {
        this.darkModeToggle = document.getElementById('dark-mode-toggle');
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();

        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        this.watchSystemTheme();
    }

    setupEventListeners() {
        if (this.darkModeToggle) {
            this.darkModeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Keyboard shortcut (Ctrl/Cmd + D)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!this.getStoredTheme()) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(this.currentTheme);
            }
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        this.storeTheme(this.currentTheme);

        // Announce to screen readers
        this.announceThemeChange();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Update toggle button
        this.updateToggleButton(theme);

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);

        // Store preference
        this.storeTheme(theme);
    }

    updateToggleButton(theme) {
        if (!this.darkModeToggle) return;

        const icon = this.darkModeToggle.querySelector('i');
        const text = this.darkModeToggle.querySelector('span');

        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        if (text) {
            text.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }

        // Update aria-label
        this.darkModeToggle.setAttribute('aria-label',
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }

    updateMetaThemeColor(theme) {
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');

        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }

        // Use primary color for light mode, dark background for dark mode
        themeColorMeta.content = theme === 'dark' ? '#1a1a1a' : '#2874f0';
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    storeTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    announceThemeChange() {
        const announcement = document.createElement('div');
        announcement.textContent = `Switched to ${this.currentTheme} mode`;
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';

        document.body.appendChild(announcement);

        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }

    // Public methods
    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.currentTheme = theme;
            this.applyTheme(theme);
            this.storeTheme(theme);
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    // Animation preferences
    respectReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // High contrast mode detection
    isHighContrast() {
        return window.matchMedia('(prefers-contrast: high)').matches;
    }
}

// Theme transition effects
class ThemeTransitionEffects {
    constructor() {
        this.transitionDuration = 300; // ms
        this.init();
    }

    init() {
        this.setupTransitionStyles();
        this.handleThemeTransitions();
    }

    setupTransitionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            [data-theme] {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }

            [data-theme] * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }

            .theme-transitioning {
                transition: none !important;
            }

            .theme-transitioning * {
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    handleThemeTransitions() {
        document.addEventListener('themechange', (e) => {
            const { theme } = e.detail;

            // Add transitioning class to prevent flash
            document.documentElement.classList.add('theme-transitioning');

            // Remove after transition
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transitioning');
            }, 50);

            // Dispatch custom event for other components
            window.dispatchEvent(new CustomEvent('themechanged', {
                detail: { theme }
            }));
        });
    }

    // Smooth transition for specific elements
    smoothTransition(element, theme) {
        if (darkModeManager.respectReducedMotion()) return;

        element.style.transition = 'none';
        const computedStyle = getComputedStyle(element);

        // Force reflow
        element.offsetHeight;

        // Re-enable transitions
        element.style.transition = '';

        // Apply theme-specific styles if needed
        if (theme === 'dark') {
            element.classList.add('dark-theme');
        } else {
            element.classList.remove('dark-theme');
        }
    }
}

// Color scheme utilities
class ColorSchemeUtils {
    static getCSSCustomProperties(theme = 'light') {
        const properties = {
            light: {
                '--primary-color': '#2874f0',
                '--bg-color': '#ffffff',
                '--text-color': '#212121',
                '--border-color': '#dadce0'
            },
            dark: {
                '--primary-color': '#2874f0',
                '--bg-color': '#1a1a1a',
                '--text-color': '#ffffff',
                '--border-color': '#404040'
            }
        };

        return properties[theme] || properties.light;
    }

    static applyCSSCustomProperties(properties) {
        Object.entries(properties).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
    }

    static getContrastRatio(color1, color2) {
        // Simple contrast ratio calculation
        const luminance1 = this.getLuminance(color1);
        const luminance2 = this.getLuminance(color2);

        const ratio = (Math.max(luminance1, luminance2) + 0.05) /
                     (Math.min(luminance1, luminance2) + 0.05);

        return ratio;
    }

    static getLuminance(color) {
        // Convert hex to RGB and calculate luminance
        const rgb = this.hexToRgb(color);
        if (!rgb) return 0;

        const [r, g, b] = rgb.map(component => {
            component = component / 255;
            return component <= 0.03928
                ? component / 12.92
                : Math.pow((component + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }
}

// Initialize dark mode functionality
document.addEventListener('DOMContentLoaded', () => {
    window.darkModeManager = new DarkModeManager();
    window.themeTransitionEffects = new ThemeTransitionEffects();
    window.colorSchemeUtils = ColorSchemeUtils;

    // Dispatch custom event when theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                const theme = document.documentElement.getAttribute('data-theme') || 'light';
                window.dispatchEvent(new CustomEvent('themechange', {
                    detail: { theme }
                }));
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});

// Export for use in other modules
window.DarkModeManager = DarkModeManager;
window.ThemeTransitionEffects = ThemeTransitionEffects;
window.ColorSchemeUtils = ColorSchemeUtils;
