document.addEventListener('DOMContentLoaded', (event) => {
    const map = document.getElementById('map');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');
    const searchInput = document.querySelector('#search input');
    const labListItems = document.querySelectorAll('#lab-list li');

    let scale = 1;
    let translateX = 0;
    let translateY = 0;

    zoomInButton.addEventListener('click', () => {
        scale += 0.2;
        updateTransform();
    });

    zoomOutButton.addEventListener('click', () => {
        scale = Math.max(1, scale - 0.2);
        updateTransform();
        autoCenter();
    });

    map.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (event.deltaY < 0) {
            scale += 0.2;
        } else {
            scale = Math.max(1, scale - 0.2);
        }
        updateTransform();
        autoCenter();
    });

    function updateTransform() {
        map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function autoCenter() {
        const mapContainer = map.parentElement;
        const maxTranslateX = (mapContainer.clientWidth * (scale - 1)) / 2;
        const maxTranslateY = (mapContainer.clientHeight * (scale - 1)) / 2;

        if (Math.abs(translateX) > maxTranslateX) {
            translateX = Math.sign(translateX) * maxTranslateX;
        }

        if (Math.abs(translateY) > maxTranslateY) {
            translateY = Math.sign(translateY) * maxTranslateY;
        }

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
            limitDrag();
            updateTransform();
        }
    });

    map.addEventListener('mouseleave', () => {
        isDragging = false;
        map.style.cursor = 'grab';
    });

    function limitDrag() {
        const mapContainer = map.parentElement;
        const maxTranslateX = (mapContainer.clientWidth * (scale - 1)) / 2;
        const maxTranslateY = (mapContainer.clientHeight * (scale - 1)) / 2;

        translateX = Math.min(maxTranslateX, Math.max(-maxTranslateX, translateX));
        translateY = Math.min(maxTranslateY, Math.max(-maxTranslateY, translateY));
    }

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        labListItems.forEach(item => {
            const labName = item.childNodes[0].textContent.toLowerCase(); // Only use the first line (lab name)
            if (labName.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
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
        scale += 0.2;
        updateTransform();
    });

    zoomOutButton.addEventListener('click', () => {
        scale = Math.max(1, scale - 0.2);
        updateTransform();
        autoCenter();
    });

    map.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (event.deltaY < 0) {
            scale += 0.2;
        } else {
            scale = Math.max(1, scale - 0.2);
        }
        updateTransform();
        autoCenter();
    });

    function updateTransform() {
        map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function autoCenter() {
        const mapContainer = map.parentElement;
        const maxTranslateX = (mapContainer.clientWidth * (scale - 1)) / 2;
        const maxTranslateY = (mapContainer.clientHeight * (scale - 1)) / 2;

        if (Math.abs(translateX) > maxTranslateX) {
            translateX = Math.sign(translateX) * maxTranslateX;
        }

        if (Math.abs(translateY) > maxTranslateY) {
            translateY = Math.sign(translateY) * maxTranslateY;
        }

        updateTransform();
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
            limitDrag();
            updateTransform();
        }
    });

    map.addEventListener('mouseleave', () => {
        isDragging = false;
        map.style.cursor = 'grab';
    });

    function limitDrag() {
        const mapContainer = map.parentElement;
        const maxTranslateX = (mapContainer.clientWidth * (scale - 1)) / 2;
        const maxTranslateY = (mapContainer.clientHeight * (scale - 1)) / 2;

        translateX = Math.min(maxTranslateX, Math.max(-maxTranslateX, translateX));
        translateY = Math.min(maxTranslateY, Math.max(-maxTranslateY, translateY));
    }
});
