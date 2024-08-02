document.addEventListener('DOMContentLoaded', (event) => {
    const map = document.getElementById('map');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');
    const searchInput = document.querySelector('#search input');
    const labList = document.getElementById('lab-list');

    let scale = 1;  // Initial scale of the map
    let translateX = 0;  // Initial horizontal translation
    let translateY = 0;  // Initial vertical translation

    // Function to update the transform property to scale and translate the map
    function updateTransform() {
        map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // Function to auto-center the map if it goes out of bounds
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

        updateTransform();  // Apply the transformation
    }

    // Zoom in the map
    zoomInButton.addEventListener('click', () => {
        scale += 0.3;  // Increase the scale
        updateTransform();  // Apply the transformation
    });

    // Zoom out the map
    zoomOutButton.addEventListener('click', () => {
        scale = Math.max(1, scale - 0.3);  // Decrease the scale, but don't go below 1
        updateTransform();  // Apply the transformation
        autoCenter();  // Auto-center the map if necessary
    });

    // Zoom in/out with the mouse wheel
    map.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (event.deltaY < 0) {
            scale += 0.3;  // Zoom in
        } else {
            scale = Math.max(1, scale - 0.3);  // Zoom out
        }
        updateTransform();  // Apply the transformation
        autoCenter();  // Auto-center the map if necessary
    });

    // Enable dragging the map
    let isDragging = false;  // Indicates whether the map is being dragged
    let startX, startY;  // Starting coordinates for the drag

    // Start dragging the map
    map.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX - translateX;
        startY = event.clientY - translateY;
        map.style.cursor = 'grabbing';  // Change cursor to grabbing
    });

    // Stop dragging the map
    document.addEventListener('mouseup', () => {
        isDragging = false;
        map.style.cursor = 'grab';  // Change cursor back to grab
    });

    // Update the map position while dragging
    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            translateX = event.clientX - startX;
            translateY = event.clientY - startY;
            limitDrag();  // Ensure the map stays within bounds
            updateTransform();  // Apply the transformation
        }
    });

    // Stop dragging the map when the mouse leaves the map area
    map.addEventListener('mouseleave', () => {
        isDragging = false;
        map.style.cursor = 'grab';  // Change cursor back to grab
    });

    // Function to ensure the map stays within bounds
    function limitDrag() {
        const mapContainer = map.parentElement;
        const maxTranslateX = (mapContainer.clientWidth * (scale - 1)) / 2;
        const maxTranslateY = (mapContainer.clientHeight * (scale - 1)) / 2;

        translateX = Math.min(maxTranslateX, Math.max(-maxTranslateX, translateX));
        translateY = Math.min(maxTranslateY, Math.max(-maxTranslateY, translateY));
    }

    // Filter the list of labs based on the search input
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        labList.querySelectorAll('li').forEach(item => {
            const labName = item.childNodes[0].textContent.toLowerCase();  // Only use the first line (lab name)
            if (labName.includes(searchTerm)) {
                item.style.display = 'block';  // Show the item if it matches the search term
            } else {
                item.style.display = 'none';  // Hide the item if it doesn't match the search term
            }
        });
    });
});

// Handle changing floors
document.addEventListener('DOMContentLoaded', (event) => {
    const map = document.getElementById('map');
    const floorSelect = document.getElementById('floor-select');

    // Change the map source based on the selected floor
    floorSelect.addEventListener('change', (event) => {
        const selectedFloor = event.target.value;
        if (selectedFloor === 'ground-floor') {
            map.src = '/Images/ST_GF.svg';  // Set the map source to the ground floor
        } else if (selectedFloor === 'second-floor') {
            map.src = '/Images/ST_2F.svg';  // Set the map source to the second floor
        }
        resetTransformations();  // Reset the transformations when the floor is changed
    });

    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');

    let scale = 1;  // Initial scale of the map
    let translateX = 0;  // Initial horizontal translation
    let translateY = 0;  // Initial vertical translation

    zoomInButton.addEventListener('click', () => {
        scale += 0.3;  // Increase the scale
        updateTransform();  // Apply the transformation
    });

    zoomOutButton.addEventListener('click', () => {
        scale = Math.max(1, scale - 0.3);  // Decrease the scale, but don't go below 1
        updateTransform();  // Apply the transformation
        autoCenter();  // Auto-center the map if necessary
    });

    map.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (event.deltaY < 0) {
            scale += 0.3;  // Zoom in
        } else {
            scale = Math.max(1, scale - 0.3);  // Zoom out
        }
        updateTransform();  // Apply the transformation
        autoCenter();  // Auto-center the map if necessary
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

        updateTransform();  // Apply the transformation
    }

    function resetTransformations() {
        scale = 1;  // Reset scale
        translateX = 0;  // Reset horizontal translation
        translateY = 0;  // Reset vertical translation
        updateTransform();  // Apply the transformation
    }

    // Enable dragging the map
    let isDragging = false;  // Indicates whether the map is being dragged
    let startX, startY;  // Starting coordinates for the drag

    // Start dragging the map
    map.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX - translateX;
        startY = event.clientY - translateY;
        map.style.cursor = 'grabbing';  // Change cursor to grabbing
    });

    // Stop dragging the map
    document.addEventListener('mouseup', () => {
        isDragging = false;
        map.style.cursor = 'grab';  // Change cursor back to grab
    });

    // Update the map position while dragging
    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            translateX = event.clientX - startX;
            translateY = event.clientY - startY;
            limitDrag();  // Ensure the map stays within bounds
            updateTransform();  // Apply the transformation
        }
    });

    // Stop dragging the map when the mouse leaves the map area
    map.addEventListener('mouseleave', () => {
        isDragging = false;
        map.style.cursor = 'grab';  // Change cursor back to grab
    });

    // Ensure the map stays within bounds
    function limitDrag() {
        const mapContainer = map.parentElement;
        const maxTranslateX = (mapContainer.clientWidth * (scale - 1)) / 2;
        const maxTranslateY = (mapContainer.clientHeight * (scale - 1)) / 2;

        translateX = Math.min(maxTranslateX, Math.max(-maxTranslateX, translateX));
        translateY = Math.min(maxTranslateY, Math.max(-maxTranslateY, translateY));
    }
});
