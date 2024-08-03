document.addEventListener('DOMContentLoaded', () => {
    const map = document.getElementById('map');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');
    const searchInput = document.querySelector('#search input');
    const labList = document.getElementById('lab-list');
    const floorSelect = document.getElementById('floor-select');

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX, startY;

    function updateTransform() {
        map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function autoCenter() {
        const mapContainer = map.parentElement;
        const maxTranslateX = (mapContainer.clientWidth * (scale - 1)) / 2;
        const maxTranslateY = (mapContainer.clientHeight * (scale - 1)) / 2;

        translateX = Math.min(maxTranslateX, Math.max(-maxTranslateX, translateX));
        translateY = Math.min(maxTranslateY, Math.max(-maxTranslateY, translateY));
        updateTransform();
    }

    function resetTransformations() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }

    zoomInButton.addEventListener('click', () => {
        scale += 0.3;
        updateTransform();
    });

    zoomOutButton.addEventListener('click', () => {
        scale = Math.max(1, scale - 0.3);
        updateTransform();
        autoCenter();
    });

    map.addEventListener('wheel', (event) => {
        event.preventDefault();
        scale += event.deltaY < 0 ? 0.3 : -0.3;
        scale = Math.max(1, scale);
        updateTransform();
        autoCenter();
    });

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
            autoCenter();
        }
    });

    map.addEventListener('mouseleave', () => {
        isDragging = false;
        map.style.cursor = 'grab';
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        labList.querySelectorAll('li').forEach(item => {
            const labName = item.getAttribute('data-lab-name').toLowerCase();
            item.style.display = labName.includes(searchTerm) ? 'block' : 'none';
        });
    });

    floorSelect.addEventListener('change', (event) => {
        map.src = event.target.value === 'ground-floor' ? '/Images/ST_GF.svg' : '/Images/ST_2F.svg';
        resetTransformations();
    });

    fetchLabs();
});

// Function to display labs in the HTML
function displayLabs(labs) {
    const labList = document.getElementById('lab-list');
    labList.innerHTML = '';

    labs.forEach(lab => {
        const labItem = document.createElement('li');
        labItem.classList.add('lab-item');
        labItem.setAttribute('data-lab-name', lab.name);  // Add data attribute for lab name

        const labName = document.createElement('div');
        labName.classList.add('lab-name');
        labName.textContent = `${lab.name} (CL${lab.labNumber})`;

        const labDetails = document.createElement('div');
        labDetails.classList.add('lab-details');
        labDetails.textContent = `${lab.floor} - ${lab.building}`;

        labItem.appendChild(labName);
        labItem.appendChild(labDetails);
        labList.appendChild(labItem);
    });
}
