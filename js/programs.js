// Programs Page JavaScript - Filtering and interactive features

document.addEventListener('DOMContentLoaded', function () {
    // Program filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const programDetails = document.querySelectorAll('.program-detail');

    if (filterButtons.length > 0 && programDetails.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                const category = this.getAttribute('data-category');

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter programs
                programDetails.forEach(program => {
                    if (category === 'all' || program.id === category) {
                        program.style.display = 'block';
                        // Add slide-down animation
                        setTimeout(() => {
                            program.style.opacity = '1';
                            program.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        program.style.opacity = '0';
                        program.style.transform = 'translateY(-20px)';
                        setTimeout(() => {
                            program.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Add smooth animations to program sections
    programDetails.forEach(program => {
        program.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        program.style.opacity = '1';
        program.style.transform = 'translateY(0)';
    });

    // Program statistics counter animation
    const statItems = document.querySelectorAll('.stat-item .stat-number');

    const animateStats = () => {
        statItems.forEach(stat => {
            const target = stat.textContent;
            const isPercentage = target.includes('%');
            const isCurrency = target.includes('$') || target.includes('₵');
            const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));

            if (!isNaN(numericValue)) {
                let startValue = 0;
                const duration = 2000; // 2 seconds
                const increment = numericValue / (duration / 16); // 60fps approximation

                const timer = setInterval(() => {
                    startValue += increment;
                    if (startValue >= numericValue) {
                        startValue = numericValue;
                        clearInterval(timer);
                    }

                    if (isCurrency) {
                        stat.textContent = utils.formatCurrency(startValue, 'GHS');
                    } else if (isPercentage) {
                        stat.textContent = Math.floor(startValue) + '%';
                    } else {
                        stat.textContent = Math.floor(startValue) + (target.includes('+') ? '+' : '');
                    }
                }, 16);
            }
        });
    };

    // Trigger stats animation when programs section is in view
    const programsSection = document.querySelector('.page-content');
    if (programsSection && statItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(programsSection);
    }

    // Feature card hover effects enhancement
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Program CTA button effects
    const ctaButtons = document.querySelectorAll('.program-cta .btn');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Smooth scroll to program sections
    const programLinks = document.querySelectorAll('a[href^="#"]');
    programLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Update URL without page reload
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // Highlight active program in navigation based on scroll position
    const programSections = document.querySelectorAll('.program-detail');
    const navLinks = document.querySelectorAll('.filter-btn');

    window.addEventListener('scroll', utils.throttle(() => {
        let current = '';
        const scrollPosition = window.scrollY + 150;

        programSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-category') === current) {
                link.classList.add('active');
            }
        });
    }, 100));

    // Add loading states to buttons
    const programButtons = document.querySelectorAll('.program-content .btn, .feature-card .btn');
    programButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Prevent default for demo purposes
            e.preventDefault();

            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;

            // Simulate loading
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;

                // Show modal or redirect in real implementation
                alert('This would redirect to the program details page in a full implementation.');
            }, 1500);
        });
    });

    // Add keyboard accessibility
    filterButtons.forEach(button => {
        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Progress indicator for program completion (if applicable)
    const createProgressIndicator = () => {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'program-progress';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-text">Loading program information...</div>
        `;
        progressContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(255,255,255,0.2);
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(progressContainer);

        // Animate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    progressContainer.style.opacity = '0';
                    setTimeout(() => {
                        progressContainer.remove();
                    }, 300);
                }, 500);
            }
            progressContainer.querySelector('.progress-fill').style.width = progress + '%';
            progressContainer.querySelector('.progress-text').textContent =
                progress < 30 ? 'Loading program information...' :
                    progress < 60 ? 'Preparing program details...' :
                        progress < 90 ? 'Almost ready...' : 'Complete!';
        }, 200);
    };

    // Show progress when filtering programs
    filterButtons.forEach(button => {
        button.addEventListener('click', createProgressIndicator);
    });

    // Add print functionality for program brochures
    const printButtons = document.querySelectorAll('[href$=".pdf"], .print-program');
    printButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            // In a real implementation, this would generate/print a PDF
            alert('In a full implementation, this would generate a printable program brochure.');
        });
    });

    // Add social sharing functionality
    const shareButtons = document.querySelectorAll('.share-program');
    shareButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const programTitle = this.closest('.program-detail').querySelector('h2').textContent;
            const shareText = `Check out the ${programTitle} program at Empower Africa Network!`;
            const shareUrl = window.location.href;

            if (navigator.share) {
                navigator.share({
                    title: programTitle,
                    text: shareText,
                    url: shareUrl
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                const tempInput = document.createElement('input');
                tempInput.value = shareUrl;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                alert('Link copied to clipboard!');
            }
        });
    });

    // Add tooltips to feature icons
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(icon => {
        const tooltip = document.createElement('div');
        tooltip.className = 'feature-tooltip';
        tooltip.textContent = icon.parentElement.querySelector('h3').textContent;
        tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.85rem;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            margin-bottom: 10px;
        `;

        icon.style.position = 'relative';
        icon.appendChild(tooltip);

        icon.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });

        icon.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
});