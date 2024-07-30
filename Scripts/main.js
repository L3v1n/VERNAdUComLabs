document.addEventListener('DOMContentLoaded', (event) => {
    const map = document.getElementById('map');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');

    let scale = 1;
    let translateX = 0;
    let translateY = 0;

    zoomInButton.addEventListener('click', () => {
        scale += 0.1;
        updateTransform();
    });

    zoomOutButton.addEventListener('click', () => {
        scale = Math.max(1, scale - 0.1);
        updateTransform();
    });

    function updateTransform() {
        map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // Draggable map functionality
    let isDragging = false;
    let startX, startY;

    map.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX - translateX;
        startY = event.clientY - translateY;
        map.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        map.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            translateX = event.clientX - startX;
            translateY = event.clientY - startY;
            updateTransform();
        }
    });

    map.addEventListener('mouseleave', () => {
        isDragging = false;
        map.style.cursor = 'grab';
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const map = document.getElementById('map');
    const floorSelect = document.getElementById('floor-select');

    floorSelect.addEventListener('change', (event) => {
        const selectedFloor = event.target.value;
        if (selectedFloor === 'ground-floor') {
            map.src = '/Images/ST_GF.svg';
        } else if (selectedFloor === 'second-floor') {
            map.src = '/Images/ST_2F.svg';
        }
        resetTransformations();
    });

    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');

    let scale = 1;
    let translateX = 0;
    let translateY = 0;

    zoomInButton.addEventListener('click', () => {
        scale += 0.1;
        updateTransform();
    });

    zoomOutButton.addEventListener('click', () => {
        scale = Math.max(1, scale - 0.1);
        updateTransform();
    });

    function updateTransform() {
        map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function resetTransformations() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }

    // Draggable map functionality
    let isDragging = false;
    let startX, startY;

    map.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX - translateX;
        startY = event.clientY - translateY;
        map.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        map.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            translateX = event.clientX - startX;
            translateY = event.clientY - startY;
            updateTransform();
        }
    });

    map.addEventListener('mouseleave', () => {
        isDragging = false;
        map.style.cursor = 'grab';
    });
});
