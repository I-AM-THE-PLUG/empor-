// Main JavaScript File - Shared functionality across all pages

document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenuBtn.innerHTML = mainNav.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('#mainNav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation helper function
    window.validateForm = function (form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                showError(field, 'This field is required');
            } else {
                field.classList.remove('error');
                hideError(field);
            }
        });

        // Email validation
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(emailField => {
            if (emailField.value && !isValidEmail(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
                showError(emailField, 'Please enter a valid email address');
            }
        });

        return isValid;
    };

    // Helper functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(field, message) {
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;

        field.parentNode.appendChild(errorDiv);
    }

    function hideError(field) {
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Input field event listeners for real-time validation
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
                showError(this, 'This field is required');
            } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                this.classList.add('error');
                showError(this, 'Please enter a valid email address');
            } else {
                this.classList.remove('error');
                hideError(this);
            }
        });

        input.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                if (this.type === 'email' && isValidEmail(this.value)) {
                    this.classList.remove('error');
                    hideError(this);
                } else if (this.type !== 'email' && this.value.trim()) {
                    this.classList.remove('error');
                    hideError(this);
                }
            }
        });
    });

    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            if (this.type === 'submit' || this.closest('form')) {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                setTimeout(() => {
                    this.innerHTML = this.dataset.originalText || this.textContent.replace('<i class="fas fa-spinner fa-spin"></i> Processing...', '');
                }, 2000);
            }
        });
    });

    // Store original button text
    buttons.forEach(button => {
        button.dataset.originalText = button.innerHTML;
    });

    // Accessibility improvements
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', function () {
        this.style.top = '0';
    });

    skipLink.addEventListener('blur', function () {
        this.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content id for skip link
    const mainContent = document.querySelector('main') || document.querySelector('.page-content') || document.querySelector('section');
    if (mainContent) {
        mainContent.id = 'main-content';
    }

    // Print functionality
    window.printPage = function () {
        window.print();
    };

    // Scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: var(--terracotta);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    document.body.appendChild(scrollToTopBtn);

    // Cookie consent banner (if needed)
    function showCookieConsent() {
        const consentGiven = localStorage.getItem('cookieConsent');
        if (!consentGiven) {
            const banner = document.createElement('div');
            banner.className = 'cookie-consent';
            banner.innerHTML = `
                <div class="cookie-content">
                    <p>We use cookies to improve your experience. By continuing to use our site, you agree to our cookie policy.</p>
                    <button id="acceptCookies" class="btn btn-small">Accept</button>
                </div>
            `;
            banner.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 20px;
                text-align: center;
                z-index: 9999;
                transform: translateY(100%);
                transition: transform 0.5s ease;
            `;

            document.body.appendChild(banner);

            // Animate in
            setTimeout(() => {
                banner.style.transform = 'translateY(0)';
            }, 1000);

            document.getElementById('acceptCookies').addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'true');
                banner.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    banner.remove();
                }, 500);
            });
        }
    }

    // Show cookie consent after a delay
    setTimeout(showCookieConsent, 2000);
});

// Utility functions
window.utils = {
    // Format currency
    formatCurrency: function (amount, currency = 'GHS') {
        return new Intl.NumberFormat('en-GH', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Format date
    formatDate: function (dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Debounce function
    debounce: function (func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: function (func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};