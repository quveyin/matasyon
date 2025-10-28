// Team Carousel Auto-rotate
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.team-carousel-track');
    const members = document.querySelectorAll('.team-carousel-member');
    const prevBtn = document.querySelector('.team-prev');
    const nextBtn = document.querySelector('.team-next');
    const dotsContainer = document.querySelector('.team-carousel-dots');
    
    if (!track || members.length === 0) return;
    
    let currentIndex = 0;
    const totalMembers = members.length;
    let autoRotateInterval;
    
    // Create dots
    for (let i = 0; i < totalMembers; i++) {
        const dot = document.createElement('div');
        dot.classList.add('team-carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.team-carousel-dot');
    
    function updateCarousel() {
        const memberWidth = members[0].offsetWidth;
        const gap = 30;
        const offset = -(currentIndex * (memberWidth + gap));
        track.style.transform = `translateX(${offset}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalMembers;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalMembers) % totalMembers;
        updateCarousel();
    }
    
    function startAutoRotate() {
        // Mobilde 5 saniye, desktop'ta 6 saniye
        const interval = window.innerWidth <= 768 ? 5000 : 6000;
        autoRotateInterval = setInterval(nextSlide, interval);
    }
    
    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }
    
    function resetAutoRotate() {
        stopAutoRotate();
        startAutoRotate();
    }
    
    // Mobilde otomatik başlat
    function checkAndStartAutoRotate() {
        if (window.innerWidth <= 768) {
            startAutoRotate();
        } else {
            stopAutoRotate();
        }
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoRotate(); // Kullanıcı tıklayınca reset
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoRotate(); // Kullanıcı tıklayınca reset
        });
    }
    
    // Touch swipe for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - Next
            nextSlide();
            resetAutoRotate();
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe right - Previous
            prevSlide();
            resetAutoRotate();
        }
    }
    
    // Update on window resize
    window.addEventListener('resize', () => {
        updateCarousel();
        checkAndStartAutoRotate(); // Ekran boyutu değişince kontrol et
    });
    
    // İlk yüklemede başlat
    checkAndStartAutoRotate();
});
