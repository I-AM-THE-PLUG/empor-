// Gallery JavaScript - Lightbox and filtering functionality

document.addEventListener('DOMContentLoaded', function () {
    // Gallery filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                const filterValue = this.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter gallery items
                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');

                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.classList.remove('hidden');
                        // Add fade-in animation
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.classList.add('hidden');
                        }, 300);
                    }
                });
            });
        });
    }

    // Lightbox functionality
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const closeBtn = document.getElementById('closeLightbox');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;
    let filteredItems = [];

    // Get all visible gallery items for navigation
    function updateFilteredItems() {
        filteredItems = Array.from(galleryItems).filter(item =>
            !item.classList.contains('hidden')
        );
    }

    // View button click handlers
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach((button, index) => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();
            openLightbox(index);
        });
    });

    // Image click handlers
    const galleryImages = document.querySelectorAll('.gallery-img');
    galleryImages.forEach((imageContainer, index) => {
        imageContainer.addEventListener('click', function () {
            openLightbox(index);
        });
    });

    // Open lightbox function
    function openLightbox(index) {
        updateFilteredItems();

        // Find the actual index in filtered items
        const actualIndex = filteredItems.findIndex(item =>
            item === galleryItems[index]
        );

        if (actualIndex !== -1) {
            currentIndex = actualIndex;
            showLightboxImage(currentIndex);
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    // Show image in lightbox
    function showLightboxImage(index) {
        if (filteredItems.length === 0) return;

        const item = filteredItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('h3')?.textContent || '';
        const description = item.querySelector('p')?.textContent || '';

        // Add loading state
        lightboxImage.style.opacity = '0';
        lightboxImage.src = '';

        // Preload image
        const preloadImg = new Image();
        preloadImg.onload = function () {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;

            // Fade in
            setTimeout(() => {
                lightboxImage.style.opacity = '1';
            }, 100);
        };
        preloadImg.src = img.src;

        // Update navigation button visibility
        prevBtn.style.display = filteredItems.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = filteredItems.length > 1 ? 'flex' : 'none';
    }

    // Navigation functions
    function navigateToNext() {
        if (filteredItems.length <= 1) return;
        currentIndex = (currentIndex + 1) % filteredItems.length;
        showLightboxImage(currentIndex);
    }

    function navigateToPrev() {
        if (filteredItems.length <= 1) return;
        currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        showLightboxImage(currentIndex);
    }

    // Event listeners for navigation
    if (nextBtn) {
        nextBtn.addEventListener('click', navigateToNext);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', navigateToPrev);
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!lightboxModal.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                navigateToNext();
                break;
            case 'ArrowLeft':
                navigateToPrev();
                break;
        }
    });

    // Close lightbox
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    // Close when clicking outside image
    if (lightboxModal) {
        lightboxModal.addEventListener('click', function (e) {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightboxModal) {
        lightboxModal.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        lightboxModal.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                navigateToNext();
            } else {
                // Swipe right - previous image
                navigateToPrev();
            }
        }
    }

    // Load more functionality
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

            // Simulate loading more images (in a real app, this would fetch from server)
            setTimeout(() => {
                // This is where you would add more gallery items dynamically
                // For demo purposes, we'll just hide the button
                this.style.display = 'none';

                // Show a message
                const message = document.createElement('p');
                message.textContent = 'All photos loaded!';
                message.style.textAlign = 'center';
                message.style.marginTop = '20px';
                message.style.color = 'var(--text-light)';
                this.parentNode.appendChild(message);
            }, 1500);
        });
    }

    // Lazy loading for images
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // Observe gallery images for lazy loading
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img && img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // Add keyboard accessibility to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Add keyboard accessibility to view buttons
    viewButtons.forEach(button => {
        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Performance optimization - debounce filter updates
    const debouncedFilter = utils.debounce(function (filterValue) {
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');

            if (filterValue === 'all' || itemCategory === filterValue) {
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 50);
            } else {
                item.style.opacity = '0';
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 300);
            }
        });
    }, 100);

    // Enhanced filtering with debouncing
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filterValue = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Apply debounced filtering
            debouncedFilter(filterValue);
        });
    });
});