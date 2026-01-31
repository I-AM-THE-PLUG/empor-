// Contact Page JavaScript - Form handling and FAQ functionality

document.addEventListener('DOMContentLoaded', function () {
    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', function () {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });

        // Add keyboard accessibility
        question.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate form
            if (validateContactForm(this)) {
                submitContactForm(this);
            }
        });
    }

    // Form validation function
    function validateContactForm(form) {
        let isValid = true;
        const formData = new FormData(form);

        // Clear previous errors
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.classList.remove('error');

            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                showFieldError(input, 'This field is required');
            }
        });

        // Email validation
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            if (!isValidEmail(emailInput.value)) {
                isValid = false;
                emailInput.classList.add('error');
                showFieldError(emailInput, 'Please enter a valid email address');
            }
        }

        // Phone validation (optional but if filled, should be valid)
        const phoneInput = form.querySelector('input[type="tel"]');
        if (phoneInput && phoneInput.value) {
            if (!isValidPhone(phoneInput.value)) {
                isValid = false;
                phoneInput.classList.add('error');
                showFieldError(phoneInput, 'Please enter a valid phone number');
            }
        }

        // Privacy policy agreement
        const privacyCheckbox = form.querySelector('input[name="privacy"]');
        if (privacyCheckbox && !privacyCheckbox.checked) {
            isValid = false;
            privacyCheckbox.classList.add('error');
            showFieldError(privacyCheckbox.parentElement, 'You must agree to the privacy policy');
        }

        return isValid;
    }

    // Form submission function
    function submitContactForm(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Simulate API call (in a real app, you'd send this to your backend)
        setTimeout(() => {
            // Success simulation
            showFormSuccess();
            form.reset();

            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;

            // Analytics tracking (if you have Google Analytics or similar)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submission', {
                    'event_category': 'Contact',
                    'event_label': data.subject || 'General Inquiry'
                });
            }

        }, 2000);
    }

    // Show success message
    function showFormSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
            </div>
        `;
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
            z-index: 10000;
            max-width: 400px;
            width: 90%;
        `;

        document.body.appendChild(successMessage);

        // Auto-close after 5 seconds
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 300);
        }, 5000);

        // Close on click outside
        successMessage.addEventListener('click', function (e) {
            if (e.target === successMessage) {
                document.body.removeChild(successMessage);
            }
        });
    }

    // Helper functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        // Basic phone validation - adjust based on your requirements
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    function showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

        // Insert after the field
        if (field.type === 'checkbox') {
            field.parentElement.parentElement.appendChild(errorDiv);
        } else {
            field.parentNode.appendChild(errorDiv);
        }
    }

    // Real-time validation
    const formInputs = contactForm ? contactForm.querySelectorAll('input, textarea, select') : [];
    formInputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }

        if (field.hasAttribute('required') && !field.value.trim()) {
            field.classList.add('error');
            showFieldError(field, 'This field is required');
            return false;
        }

        if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
            field.classList.add('error');
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }

        if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
            field.classList.add('error');
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }

        if (field.type === 'checkbox' && field.name === 'privacy' && !field.checked) {
            field.classList.add('error');
            showFieldError(field.parentElement, 'You must agree to the privacy policy');
            return false;
        }

        return true;
    }

    // Auto-save form data (in case of accidental refresh)
    if (contactForm) {
        const autosaveFields = contactForm.querySelectorAll('input, textarea, select');
        autosaveFields.forEach(field => {
            // Load saved data
            const savedValue = localStorage.getItem(`contact_${field.name}`);
            if (savedValue) {
                field.value = savedValue;
            }

            // Save on input
            field.addEventListener('input', function () {
                localStorage.setItem(`contact_${this.name}`, this.value);
            });
        });

        // Clear saved data on successful submission
        contactForm.addEventListener('submit', function () {
            autosaveFields.forEach(field => {
                localStorage.removeItem(`contact_${field.name}`);
            });
        });
    }

    // Location map interactions
    const locationCards = document.querySelectorAll('.location-card');
    locationCards.forEach(card => {
        card.addEventListener('click', function () {
            const locationName = this.querySelector('h3').textContent;

            // In a real implementation, this would show the location on a map
            alert(`Showing ${locationName} on map. In a full implementation, this would integrate with Google Maps or similar.`);
        });

        // Add hover effect
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Social media contact buttons
    const socialLinks = document.querySelectorAll('.social-links.large a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const platform = this.textContent.trim();
            const urls = {
                'Facebook': 'https://facebook.com/empowerafricanetwork',
                'Twitter': 'https://twitter.com/empowernafrica',
                'Instagram': 'https://instagram.com/empowernafrica',
                'LinkedIn': 'https://linkedin.com/company/empower-africa-network',
                'YouTube': 'https://youtube.com/@empowernafrica'
            };

            // Open in new tab
            window.open(urls[platform] || this.href, '_blank');
        });
    });

    // Add copy functionality for contact details
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.className = 'copy-button';
        copyButton.setAttribute('aria-label', 'Copy contact information');
        copyButton.style.cssText = `
            background: none;
            border: none;
            color: var(--terracotta);
            cursor: pointer;
            margin-left: 10px;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        `;

        copyButton.addEventListener('mouseenter', function () {
            this.style.opacity = '1';
        });

        copyButton.addEventListener('mouseleave', function () {
            this.style.opacity = '0.7';
        });

        copyButton.addEventListener('click', function () {
            const textToCopy = item.querySelector('.contact-text').innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show feedback
                const feedback = document.createElement('span');
                feedback.textContent = 'Copied!';
                feedback.style.cssText = `
                    position: absolute;
                    background: var(--terracotta);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    margin-left: 10px;
                    animation: fadeInOut 2s ease;
                `;

                item.style.position = 'relative';
                item.appendChild(feedback);

                setTimeout(() => {
                    feedback.remove();
                }, 2000);
            });
        });

        const contactText = item.querySelector('.contact-text');
        contactText.style.display = 'flex';
        contactText.style.alignItems = 'flex-start';
        contactText.appendChild(copyButton);
    });

    // Add CSS for copy feedback animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(10px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);

    // Chat widget simulation (would connect to actual chat service)
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = `
        <button class="chat-toggle">
            <i class="fas fa-comments"></i>
            <span>Chat with us</span>
        </button>
        <div class="chat-window">
            <div class="chat-header">
                <h4>Live Chat</h4>
                <button class="chat-close">&times;</button>
            </div>
            <div class="chat-messages">
                <div class="message received">
                    <p>Hello! How can we help you today?</p>
                    <span class="time">Just now</span>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message...">
                <button><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    chatWidget.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
    `;

    document.body.appendChild(chatWidget);

    // Chat toggle functionality
    const chatToggle = chatWidget.querySelector('.chat-toggle');
    const chatWindow = chatWidget.querySelector('.chat-window');
    const chatClose = chatWidget.querySelector('.chat-close');

    chatToggle.addEventListener('click', function () {
        chatWindow.style.display = 'flex';
        chatToggle.style.display = 'none';
    });

    chatClose.addEventListener('click', function () {
        chatWindow.style.display = 'none';
        chatToggle.style.display = 'flex';
    });

    // Add styles for chat widget
    const chatStyle = document.createElement('style');
    chatStyle.textContent = `
        .chat-toggle {
            background: var(--terracotta);
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 30px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(210, 105, 30, 0.3);
            transition: all 0.3s ease;
        }
        
        .chat-toggle:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(210, 105, 30, 0.4);
        }
        
        .chat-window {
            display: none;
            flex-direction: column;
            width: 350px;
            height: 450px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        
        .chat-header {
            background: var(--dark-green);
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chat-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
        }
        
        .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: var(--light-gray);
        }
        
        .message {
            margin-bottom: 15px;
            max-width: 80%;
        }
        
        .message.received {
            background: white;
            padding: 12px 15px;
            border-radius: 18px 18px 18px 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .time {
            font-size: 0.7rem;
            color: var(--text-light);
            margin-top: 5px;
            display: block;
        }
        
        .chat-input {
            display: flex;
            padding: 15px;
            background: white;
            border-top: 1px solid #eee;
        }
        
        .chat-input input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 20px;
            margin-right: 10px;
        }
        
        .chat-input button {
            background: var(--terracotta);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
        }
    `;
    document.head.appendChild(chatStyle);
});