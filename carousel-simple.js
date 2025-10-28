// True Seamless Infinite Carousel
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.services .prev-btn');
    const nextBtn = document.querySelector('.services .next-btn');
    const originalCards = Array.from(document.querySelectorAll('.service-card'));
    
    if (!track || originalCards.length === 0) {
        console.log('Carousel elements not found');
        return;
    }
    
    const cardWidth = 250; // 220px card + 30px gap
    const totalCards = originalCards.length;
    
    // Clone cards 10 times for truly seamless loop
    for (let round = 0; round < 5; round++) {
        for (let j = originalCards.length - 1; j >= 0; j--) {
            const clone = originalCards[j].cloneNode(true);
            track.insertBefore(clone, track.firstChild);
        }
    }
    
    for (let round = 0; round < 5; round++) {
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });
    }
    
    // Start from middle
    let currentPosition = totalCards * 5;
    
    console.log('Carousel:', { totalCards, start: currentPosition, total: track.children.length });
    
    function moveCarousel(animate = true) {
        track.style.transition = animate ? 'transform 0.5s ease' : 'none';
        track.style.transform = `translateX(${-currentPosition * cardWidth}px)`;
    }
    
    let isMoving = false;
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (isMoving) return;
            isMoving = true;
            
            currentPosition++;
            moveCarousel(true);
            
            setTimeout(() => {
                // Reset to middle when getting too far
                if (currentPosition > totalCards * 8) {
                    currentPosition = totalCards * 5 + (currentPosition % totalCards);
                    moveCarousel(false);
                }
                isMoving = false;
            }, 500);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (isMoving) return;
            isMoving = true;
            
            currentPosition--;
            moveCarousel(true);
            
            setTimeout(() => {
                // Reset to middle when getting too far back
                if (currentPosition < totalCards * 2) {
                    currentPosition = totalCards * 5 - (totalCards - (currentPosition % totalCards));
                    moveCarousel(false);
                }
                isMoving = false;
            }, 500);
        });
    }
    
    moveCarousel(false);
});
