// Your Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDvI3RjE7Qac6MnuuVj6-fVtZbYFTBCgpw",
    authDomain: "vern-adu-comlabs.firebaseapp.com",
    projectId: "vern-adu-comlabs",
    storageBucket: "vern-adu-comlabs.appspot.com",
    messagingSenderId: "830463891195",
    appId: "1:830463891195:web:2b68e6f4c39ce5f0b9425e",
    measurementId: "G-NH00V61C5T"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// List of computer laboratories to be stored in Firestore
const initialLabs = [
    { name: "Computer Laboratory 1", floor: "Ground Floor", building: "ST Building", labNumber: 1 },
    { name: "Computer Laboratory 2", floor: "Ground Floor", building: "ST Building", labNumber: 2 },
    { name: "Computer Laboratory 3", floor: "Ground Floor", building: "ST Building", labNumber: 3 },
    { name: "Computer Laboratory 4", floor: "Ground Floor", building: "ST Building", labNumber: 4 },
    { name: "Computer Laboratory 5", floor: "Ground Floor", building: "ST Building", labNumber: 5 },
    { name: "Computer Laboratory 6", floor: "Ground Floor", building: "ST Building", labNumber: 6 },
    { name: "Computer Laboratory 7", floor: "2nd Floor", building: "ST Building", labNumber: 7 },
    { name: "Computer Laboratory 8", floor: "2nd Floor", building: "ST Building", labNumber: 8 },
    { name: "Computer Laboratory 9", floor: "2nd Floor", building: "ST Building", labNumber: 9 }
];

// Function to initialize labs in Firestore
async function initializeLabs() {
    const labsCollection = db.collection('labs');
    const snapshot = await labsCollection.get();

    if (snapshot.empty) {
        initialLabs.forEach(async (lab) => {
            await labsCollection.add(lab);
        });
        console.log('Labs initialized in Firestore');
    } else {
        console.log('Labs already exist in Firestore');
    }

    fetchLabs();
}

// Fetch Labs from Firestore
async function fetchLabs() {
    const snapshot = await db.collection('labs').orderBy('labNumber').get();
    const labs = snapshot.docs.map(doc => doc.data());
    console.log('Fetched labs:', labs);

    // Display labs in your HTML
    const labList = document.getElementById('lab-list');
    labList.innerHTML = '';
    labs.forEach(lab => {
        const listItem = document.createElement('li');
        listItem.textContent = `${lab.name} (${lab.floor}) - ${lab.building}`;
        labList.appendChild(listItem);
    });
}

// Initialize labs and fetch them on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeLabs();
});
