document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const labListItems = document.querySelectorAll('#lab-list li');
    const mapContainer = document.querySelector('.map-container');
    const map = document.querySelector('.map');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');
    let scale = 1;
    const scaleStep = 0.25;  // Increased zoom step
    const maxScale = 5;  // Increased maximum scale
    const minScale = 0.25;  // Decreased minimum scale
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    let lastX, lastY;

    // Prevent default drag behavior
    mapContainer.addEventListener('dragstart', (e) => e.preventDefault());
    map.addEventListener('dragstart', (e) => e.preventDefault());

    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toLowerCase();
        labListItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(filter)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });

    zoomInButton.addEventListener('click', () => {
        if (scale < maxScale) {
            scale += scaleStep;
            map.style.transition = 'transform 0.1s ease-out';  // Only transition on zoom
            map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }
    });

    zoomOutButton.addEventListener('click', () => {
        if (scale > minScale) {
            scale -= scaleStep;
            map.style.transition = 'transform 0.1s ease-out';  // Only transition on zoom
            map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }
    });

    const onDrag = (e) => {
        if (isDragging) {
            e.preventDefault();
            lastX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
            lastY = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
            translateX = lastX;
            translateY = lastY;
            map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }
    };

    mapContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        mapContainer.style.cursor = 'grabbing';
        lastX = translateX;
        lastY = translateY;
        document.addEventListener('mousemove', onDrag);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        mapContainer.style.cursor = 'grab';
        document.removeEventListener('mousemove', onDrag);
    });

    mapContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
        mapContainer.style.cursor = 'grabbing';
        lastX = translateX;
        lastY = translateY;
        document.addEventListener('touchmove', onDrag);
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
        mapContainer.style.cursor = 'grab';
        document.removeEventListener('touchmove', onDrag);
    });
});
