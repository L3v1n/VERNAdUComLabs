import { AStar, Node } from './aStar.js';
import { fetchSvgUrls, fetchLabs, fetchWalkablePaths, fetchNonWalkablePaths, fetchStartPoint } from './database.js';

document.addEventListener('DOMContentLoaded', async () => {
    const mapContainer = document.getElementById('map-container');
    const gridLayer = document.getElementById('grid-layer');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');
    const searchInput = document.querySelector('#search input');
    const labList = document.getElementById('lab-list');
    const floorSelect = document.getElementById('floor-select');
    const svgNamespace = "http://www.w3.org/2000/svg";

    const zoomLevels = [1, 1.5, 2, 2.5];
    const maxZoomIndex = zoomLevels.length - 1;
    const zoomTransitionDuration = 0.5;
    let currentZoomIndex = 0;
    let translateX = 0, translateY = 0;
    let isDragging = false;
    let startX, startY;
    let currentMapImage = null;
    let currentFloor = 'ground-floor';
    let startPoint = { x: 0, y: 0 };
    let walkablePaths = {};
    let nonWalkablePaths = {};

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const updateTransform = () => {
        const scale = zoomLevels[currentZoomIndex];
        mapContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        mapContainer.querySelectorAll('.map-marker, .path-line').forEach(element => {
            element.style.transform = `scale(${1 / scale})`;
        });
        gridLayer.style.transform = `scale(${scale})`;
        updateZoomButtons();
    };

    const resetTransformations = () => {
        currentZoomIndex = 0;
        translateX = 0;
        translateY = 0;
        updateTransform();
    };

    const smoothZoomReset = (callback) => {
        mapContainer.style.transition = `transform ${zoomTransitionDuration}s ease`;
        resetTransformations();
        setTimeout(() => {
            mapContainer.style.transition = '';
            if (callback) callback();
        }, zoomTransitionDuration * 1000);
    };

    const handleZoom = (increment) => {
        mapContainer.style.transition = `transform ${zoomTransitionDuration}s ease`;
        currentZoomIndex = Math.max(0, Math.min(maxZoomIndex, currentZoomIndex + increment));
        autoCenter();
        updateTransform();
        setTimeout(() => {
            mapContainer.style.transition = '';
        }, zoomTransitionDuration * 1000);
    };

    const autoCenter = () => {
        const scale = zoomLevels[currentZoomIndex];
        const maxTranslateX = (mapContainer.clientWidth * (scale - 1)) / 2;
        const maxTranslateY = (mapContainer.clientHeight * (scale - 1)) / 2;

        translateX = Math.min(maxTranslateX, Math.max(-maxTranslateX, translateX));
        translateY = Math.min(maxTranslateY, Math.max(-maxTranslateY, translateY));
        updateTransform();
    };

    const updateZoomButtons = () => {
        zoomInButton.disabled = currentZoomIndex === maxZoomIndex;
        zoomOutButton.disabled = currentZoomIndex === 0;
    };

    const switchMapFloor = (floor, callback) => {
        if (currentFloor !== floor) {
            const newBackgroundImage = floor === 'ground-floor' ? window.svgUrls.groundFloor : window.svgUrls.secondFloor;
            loadImage(newBackgroundImage);
            mapContainer.style.backgroundImage = `url(${newBackgroundImage})`;
            smoothZoomReset(() => {
                resetTransformations();
                floorSelect.value = floor;
                currentFloor = floor;
                if (callback) callback();
            });
        } else if (callback) {
            callback();
        }
    };

    const loadImage = (src) => {
        currentMapImage = new Image();
        currentMapImage.src = src;
    };

    const fetchAndDisplayLabs = async () => {
        const labs = await fetchLabs();
        labList.innerHTML = '';

        const fragment = document.createDocumentFragment();

        labs.forEach(lab => {
            const labItem = document.createElement('li');
            labItem.classList.add('lab-item');
            labItem.setAttribute('data-lab-name', lab.name);

            const labName = document.createElement('div');
            labName.classList.add('lab-name');
            labName.textContent = lab.name;

            const labDetails = document.createElement('div');
            labDetails.classList.add('lab-details');
            labDetails.textContent = `${lab.floor} - ${lab.building}`;

            labItem.appendChild(labName);
            labItem.appendChild(labDetails);
            fragment.appendChild(labItem);

            labItem.addEventListener('click', () => {
                const floor = lab.name.includes('7') || lab.name.includes('8') || lab.name.includes('9') ? 'second-floor' : 'ground-floor';
                switchMapFloor(floor, () => {
                    clearSelection();
                    if (currentFloor !== 'second-floor') {
                        addMarkerToMap(startPoint, "Start");
                    }
                    addMarkerToMap({ x: lab.x, y: lab.y }, lab.name);
                    calculatePath(startPoint, { x: lab.x, y: lab.y });
                    showDirectionsOverlay(lab);
                });
            });
        });

        labList.appendChild(fragment);
    };

    const calculatePath = (start, end) => {
        const grid = createGrid();
        if (!isValidGridCoordinate(grid, start) || !isValidGridCoordinate(grid, end)) {
            console.error("Invalid grid coordinates:", start, end);
            return;
        }
        const startNode = grid[start.y][start.x];
        const endNode = grid[end.y][end.x];
        const aStar = new AStar(grid, startNode, endNode);
        const path = aStar.findPath();

        if (path.length > 0) {
            drawPath(path);
        } else {
            console.log("No path found.");
        }
    };

    const isValidGridCoordinate = (grid, coord) => {
        return coord.y >= 0 && coord.y < grid.length && coord.x >= 0 && coord.x < grid[0].length;
    };

    const drawPath = (path) => {
        const pathElement = document.createElementNS(svgNamespace, 'path');
        const d = path.map((node, index) => {
            const point = `${node.x * 10},${node.y * 10}`; // Adjust coordinates by grid cell size
            return index === 0 ? `M${point}` : `L${point}`;
        }).join(' ');

        pathElement.setAttribute('d', d);
        pathElement.setAttribute('stroke', 'blue');
        pathElement.setAttribute('stroke-width', '2');
        pathElement.setAttribute('fill', 'none');
        pathElement.classList.add('path-line');

        mapContainer.appendChild(pathElement);
    };

    const createGrid = () => {
        const gridWidth = Math.ceil(mapContainer.clientWidth / 10);
        const gridHeight = Math.ceil(mapContainer.clientHeight / 10);
        
        const grid = [];
        for (let y = 0; y < gridHeight; y++) {
            const row = [];
            for (let x = 0; x < gridWidth; x++) {
                const walkable = isWalkablePath(x, y);
                row.push(new Node(x, y, walkable));
            }
            grid.push(row);
        }
        drawGrid(gridWidth, gridHeight);
        return grid;
    };

    const drawGrid = (width, height) => {
        gridLayer.innerHTML = ''; // Clear any existing grid lines
        for (let x = 0; x <= width; x++) {
            const line = document.createElementNS(svgNamespace, 'line');
            line.setAttribute('x1', x * 10);
            line.setAttribute('y1', 0);
            line.setAttribute('x2', x * 10);
            line.setAttribute('y2', height * 10);
            line.classList.add('grid-line');
            gridLayer.appendChild(line);
        }
        for (let y = 0; y <= height; y++) {
            const line = document.createElementNS(svgNamespace, 'line');
            line.setAttribute('x1', 0);
            line.setAttribute('y1', y * 10);
            line.setAttribute('x2', width * 10);
            line.setAttribute('y2', y * 10);
            line.classList.add('grid-line');
            gridLayer.appendChild(line);
        }
    };

    const isWalkablePath = (x, y) => {
        const floorPaths = currentFloor === 'ground-floor' ? walkablePaths.groundFloor : walkablePaths.secondFloor;
        const nonWalkable = currentFloor === 'ground-floor' ? nonWalkablePaths.groundFloor : nonWalkablePaths.secondFloor;

        const walkable = floorPaths && Array.isArray(floorPaths) && floorPaths.some(path => path.x === x && path.y === y);
        const notWalkable = nonWalkable && Array.isArray(nonWalkable) && nonWalkable.some(path => path.x === x && path.y === y);

        return walkable && !notWalkable;
    };

    const clearMarkers = () => {
        const markers = document.querySelectorAll('.map-marker');
        markers.forEach(marker => marker.remove());
    };

    const clearPath = () => {
        const paths = document.querySelectorAll('.path-line');
        paths.forEach(path => path.remove());
    };

    const addMarkerToMap = async (coordinates, title) => {
        const marker = document.createElement('img');
        if (title === "Start" && currentFloor !== 'second-floor') {
            marker.src = 'Images/start.svg';
        } else {
            marker.src = 'Images/marker.svg';
        }
        marker.classList.add('map-marker');
        marker.style.left = `${coordinates.x}px`; // Use absolute positioning
        marker.style.top = `${coordinates.y}px`; // Use absolute positioning
        marker.title = title;

        await requestAnimationFrame(() => {
            mapContainer.appendChild(marker);
        });
    };

    const clearSelection = () => {
        selectedLab = null;
        clearMarkers();
        clearPath();
        directionsOverlay.classList.add('hidden');
    };

    const directionsOverlay = document.getElementById('directions-overlay');
    const overlayClose = document.getElementById('overlay-close');
    const labNameElement = document.getElementById('lab-name');

    let selectedLab = null;

    overlayClose.addEventListener('click', () => {
        clearSelection();
    });

    const showDirectionsOverlay = (lab) => {
        selectedLab = lab;
        labNameElement.textContent = lab.name;
        directionsOverlay.classList.remove('hidden');
    };

    try {
        const [svgUrls, fetchedLabs, fetchedWalkablePaths, fetchedNonWalkablePaths, fetchedStartPoint] = await Promise.all([
            fetchSvgUrls(),
            fetchLabs(),
            fetchWalkablePaths(),
            fetchNonWalkablePaths(),
            fetchStartPoint()
        ]);

        if (svgUrls) {
            window.svgUrls = svgUrls;
            loadImage(window.svgUrls.groundFloor);
            mapContainer.style.backgroundImage = `url(${window.svgUrls.groundFloor})`;
        }

        walkablePaths = fetchedWalkablePaths || {};
        nonWalkablePaths = fetchedNonWalkablePaths || {};
        startPoint = fetchedStartPoint || startPoint;

        fetchAndDisplayLabs();

        zoomInButton.addEventListener('click', () => handleZoom(1));
        zoomOutButton.addEventListener('click', () => handleZoom(-1));

        mapContainer.addEventListener('wheel', debounce((event) => {
            event.preventDefault();
            const delta = Math.sign(event.deltaY);
            handleZoom(-delta);
        }, 50));

        mapContainer.addEventListener('mousedown', (event) => {
            isDragging = true;
            startX = event.clientX - translateX;
            startY = event.clientY - translateY;
            mapContainer.style.cursor = 'grabbing';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            mapContainer.style.cursor = 'grab';
        });

        document.addEventListener('mousemove', debounce((event) => {
            if (isDragging) {
                translateX = event.clientX - startX;
                translateY = event.clientY - startY;
                autoCenter();
            }
        }, 10));

        searchInput.addEventListener('input', debounce(() => {
            const searchTerm = searchInput.value.toLowerCase();
            labList.querySelectorAll('.lab-item').forEach(item => {
                const labName = item.getAttribute('data-lab-name').toLowerCase();
                item.style.display = labName.includes(searchTerm) ? 'block' : 'none';
            });
        }, 300));

        floorSelect.addEventListener('change', (event) => {
            const selectedFloor = event.target.value;
            switchMapFloor(selectedFloor, clearMarkers);
        });
    } catch (error) {
        console.error("Error during initialization:", error);
    }
});
