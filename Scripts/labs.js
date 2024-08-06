import firebaseConfig from './firebaseConfig.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const labsData = [
    {
        id: 'comLab1',
        building: 'ST Building',
        floor: 'Ground Floor',
        labNumber: 1,
        name: 'Computer Laboratory 1 (CL1)',
        x: 500,
        y: 260
    },
    {
        id: 'comLab2',
        building: 'ST Building',
        floor: 'Ground Floor',
        labNumber: 2,
        name: 'Computer Laboratory 2 (CL2)',
        x: 570,
        y: 260
    },
    {
        id: 'comLab3',
        building: 'ST Building',
        floor: 'Ground Floor',
        labNumber: 3,
        name: 'Computer Laboratory 3 (CL3)',
        x: 680,
        y: 260
    },
    {
        id: 'comLab4',
        building: 'ST Building',
        floor: 'Ground Floor',
        labNumber: 4,
        name: 'Computer Laboratory 4 (CL4)',
        x: 870,
        y: 260
    },
    {
        id: 'comLab5',
        building: 'ST Building',
        floor: 'Ground Floor',
        labNumber: 5,
        name: 'Computer Laboratory 5 (CL5)',
        x: 540,
        y: 600
    },
    {
        id: 'comLab6',
        building: 'ST Building',
        floor: 'Ground Floor',
        labNumber: 6,
        name: 'Computer Laboratory 6 (CL6)',
        x: 250,
        y: 600
    },
    {
        id: 'comLab7',
        building: 'ST Building',
        floor: '2nd Floor',
        labNumber: 7,
        name: 'Computer Laboratory 7 (CL7)',
        x: 300,
        y: 380
    },
    {
        id: 'comLab8',
        building: 'ST Building',
        floor: '2nd Floor',
        labNumber: 8,
        name: 'Computer Laboratory 8 (CL8)',
        x: 300,
        y: 380
    },
    {
        id: 'comLab9',
        building: 'ST Building',
        floor: '2nd Floor',
        labNumber: 9,
        name: 'Computer Laboratory 9 (CL9)',
        x: 300,
        y: 380
    }
];

const saveLabsToFirestore = async () => {
    for (const lab of labsData) {
        try {
            const labDocRef = doc(db, 'labs', lab.id);
            const labDocSnap = await getDoc(labDocRef);

            if (!labDocSnap.exists()) {
                await setDoc(labDocRef, lab);
            } else {
                const existingLabData = labDocSnap.data();
                if (JSON.stringify(existingLabData) !== JSON.stringify(lab)) {
                    await setDoc(labDocRef, lab);
                }
            }
        } catch (error) {
            console.error("Error saving lab data:", error);
        }
    }
};

saveLabsToFirestore();
