document.addEventListener('DOMContentLoaded', () => {
    const laboratories = [
        { name: "CL-1", distance: 0 },
        { name: "CL-2", distance: 5 },
        { name: "CL-3", distance: 8 },
        { name: "CL-4", distance: 3 },
        { name: "CL-5", distance: 12 },
    ];

    const currentLocation = document.getElementById('current-location');
    const laboratoriesList = document.getElementById('laboratories-list');
    const directionsBox = document.getElementById('directions-box');
    const directionsText = document.getElementById('directions');
    const goButton = document.getElementById('go-button');
    const backButton = document.getElementById('back-button');
    const searchBar = document.getElementById('search-bar');
    
    const updateLocation = () => {
        currentLocation.textContent = "ST Building";  // Update this based on user input
        updateDistances();
        sortAndDisplayLabs();
    };

    const updateDistances = () => {
        laboratories.forEach(lab => {
            // Calculate distance and update lab.distance
            lab.distance = Math.floor(Math.random() * 20); // Placeholder logic
        });
    };

    const sortAndDisplayLabs = () => {
        laboratories.sort((a, b) => a.distance - b.distance);
        displayLabs(laboratories);
    };

    const displayLabs = (labs) => {
        laboratoriesList.innerHTML = '';
        labs.forEach(lab => {
            const li = document.createElement('li');
            li.textContent = `${lab.name} (${lab.distance}m)`;
            li.addEventListener('click', () => showDirections(lab));
            laboratoriesList.appendChild(li);
        });
    };

    const showDirections = (lab) => {
        directionsText.textContent = `Directions to ${lab.name}: ...`;
        directionsBox.classList.remove('hidden');
    };

    const filterLabs = (searchTerm) => {
        const filteredLabs = laboratories.filter(lab => 
            lab.name.toLowerCase().includes(searchTerm.toLowerCase()));
        displayLabs(filteredLabs);
    };

    document.getElementById('update-location').addEventListener('click', updateLocation);
    searchBar.addEventListener('input', (e) => filterLabs(e.target.value));
    goButton.addEventListener('click', () => {
        alert('Navigation started!');
        // Add navigation logic here
    });
    backButton.addEventListener('click', () => {
        directionsBox.classList.add('hidden');
    });

    updateDistances();
    sortAndDisplayLabs();
});
