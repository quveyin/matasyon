// Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting initialization');

    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cards = document.querySelectorAll('.service-card');

    console.log('Found elements:', {
        track: !!track,
        prevBtn: !!prevBtn,
        nextBtn: !!nextBtn,
        cardsCount: cards.length
    });

    // Initialize carousel only if elements exist
    if (track && cards.length > 0) {
        initializeCarousel();
    } else {
        console.log('Carousel elements not found - skipping carousel initialization');
    }

    // Mobile menu initialization - always run
    initializeMobileMenu();

    // Other initializations
    initializeAnimations();
    initializeHeaderEffects();
    initializeResponsive();

    function initializeCarousel() {
        console.log('Initializing carousel');

        let currentIndex = 0;
        
        // Responsive card width calculation
        function getCardWidth() {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 480) {
                return 172; // 160px + 12px gap
            } else if (screenWidth <= 768) {
                return 195; // 180px + 15px gap
            } else if (screenWidth <= 1024) {
                return 215; // 200px + 15px gap
            } else {
                return 250; // 220px + 30px gap (default)
            }
        }
        
        let cardWidth = getCardWidth();
        const totalCards = cards.length;
        
        // Get number of visible cards based on screen width
        function getVisibleCards() {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 480) {
                return 1; // 1 card on mobile
            } else if (screenWidth <= 768) {
                return 2; // 2 cards on small tablet
            } else if (screenWidth <= 1024) {
                return 3; // 3 cards on tablet
            } else {
                return 5; // 5 cards on desktop
            }
        }
        
        let visibleCards = getVisibleCards();

        console.log('Carousel setup:', { totalCards, cardWidth, visibleCards });

        // Show carousel buttons
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';

        // Simple clone - just double the cards
        function setupInfiniteLoop() {
            if (!track || totalCards === 0) return;
            console.log('Setting up infinite loop');
            
            // Just clone all cards once and append
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                track.appendChild(clone);
            });
            
            console.log('Total cards now:', track.children.length);
        }

        // Update carousel position
        function updateCarousel() {
            const offset = -currentIndex * cardWidth;
            track.style.transform = `translateX(${offset}px)`;
        }

        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                track.style.transition = 'transform 0.5s ease';
                currentIndex++;
                updateCarousel();
                
                // When we reach the end, instantly jump back to start
                if (currentIndex >= totalCards) {
                    setTimeout(() => {
                        track.style.transition = 'none';
                        currentIndex = 0;
                        updateCarousel();
                        // Force reflow
                        track.offsetHeight;
                        track.style.transition = 'transform 0.5s ease';
                    }, 500);
                }
            });
        }

        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex <= 0) {
                    // Jump to end instantly
                    track.style.transition = 'none';
                    currentIndex = totalCards;
                    updateCarousel();
                    // Force reflow
                    track.offsetHeight;
                    // Then animate back one
                    setTimeout(() => {
                        track.style.transition = 'transform 0.5s ease';
                        currentIndex--;
                        updateCarousel();
                    }, 50);
                } else {
                    track.style.transition = 'transform 0.5s ease';
                    currentIndex--;
                    updateCarousel();
                }
            });
        }

        // Touch swipe for carousel on mobile
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        if (track) {
            track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            track.addEventListener('touchmove', (e) => {
                // Prevent vertical scroll while swiping horizontally
                const touchMoveX = e.changedTouches[0].screenX;
                const touchMoveY = e.changedTouches[0].screenY;
                const diffX = Math.abs(touchMoveX - touchStartX);
                const diffY = Math.abs(touchMoveY - touchStartY);
                
                if (diffX > diffY) {
                    e.preventDefault();
                }
            }, { passive: false });

            track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                handleSwipe();
            }, { passive: true });
        }

        function handleSwipe() {
            const diffX = touchStartX - touchEndX;
            const diffY = Math.abs(touchStartY - touchEndY);
            
            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(diffX) > diffY && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - Next
                    if (nextBtn) nextBtn.click();
                } else {
                    // Swipe right - Previous
                    if (prevBtn) prevBtn.click();
                }
            }
        }

        // Initialize carousel
        if (track && cards.length > 0) {
            console.log('Initializing carousel with', cards.length, 'cards');
            setupInfiniteLoop();
            currentIndex = 0;
            updateCarousel();
            console.log('Carousel initialized');
        }

        // Responsive carousel updates
        window.addEventListener('resize', () => {
            // Update card width and visible cards on resize
            const newCardWidth = getCardWidth();
            const newVisibleCards = getVisibleCards();
            if (newCardWidth !== cardWidth || newVisibleCards !== visibleCards) {
                cardWidth = newCardWidth;
                visibleCards = newVisibleCards;
                console.log('Resize - Updated:', { cardWidth, visibleCards });
                updateCarousel();
            }
        });
    }

    function initializeMobileMenu() {
        console.log('Initializing mobile menu');
        
        // Mobile menu toggle - Modern sidebar implementation
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenuSidebar = document.querySelector('.mobile-menu-sidebar');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

        // Open mobile menu
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                if (mobileMenuSidebar && mobileMenuOverlay) {
                    mobileMenuSidebar.classList.add('active');
                    mobileMenuOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        }

        // Close mobile menu function
        function closeMobileMenu() {
            if (mobileMenuSidebar && mobileMenuOverlay) {
                mobileMenuSidebar.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        // Make closeMobileMenu globally accessible
        window.closeMobileMenu = closeMobileMenu;

        // Close button click
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }

        // Close when clicking overlay
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        }

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuSidebar && mobileMenuSidebar.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    function initializeAnimations() {
        console.log('Initializing animations');
        
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections
        document.querySelectorAll('.service-card, .stat-card, .team-member, .about-content').forEach(el => {
            observer.observe(el);
        });

        // Stats counter animation
        const statNumbers = document.querySelectorAll('.stat-number');
        let hasAnimated = false;

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.textContent);
                        const duration = 2000;
                        const increment = target / (duration / 16);
                        let current = 0;

                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                stat.textContent = Math.ceil(current) + '+';
                                requestAnimationFrame(updateCounter);
                            } else {
                                stat.textContent = target + '+';
                            }
                        };

                        updateCounter();
                    });
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }

    function initializeHeaderEffects() {
        console.log('Initializing header effects');
        
        // Header scroll effect
        let lastScroll = 0;
        const header = document.querySelector('.header');

        if (header) {
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;

                if (currentScroll <= 0) {
                    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
                } else {
                    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.8)';
                }

                lastScroll = currentScroll;
            });
        }
    }

    function initializeResponsive() {
        console.log('Initializing responsive features');
        
        const nav = document.querySelector('.nav');
        
        // Responsive navigation
        window.addEventListener('resize', () => {
            if (nav) {
                if (window.innerWidth > 768) {
                    nav.style.display = 'flex';
                } else {
                    nav.style.display = 'none';
                }
            }
        });
    }
});
