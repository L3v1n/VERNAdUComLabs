import firebaseConfig from './firebaseConfig.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, query, where } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const fetchDocumentData = async (docPath) => {
    try {
        const docRef = doc(db, docPath);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (e) {
        console.error(`Error fetching document at ${docPath}:`, e);
        return null;
    }
};

export const fetchSvgUrls = async () => fetchDocumentData('maps/stBuilding');

export const fetchLabs = async () => {
    try {
        const labsQuery = query(collection(db, "labs"), where("building", "==", "ST Building"));
        const querySnapshot = await getDocs(labsQuery);
        return querySnapshot.docs.map(doc => doc.data());
    } catch (e) {
        console.error("Error fetching labs:", e);
        return [];
    }
};

export const fetchWalkablePaths = async () => {
    try {
        const snapshot = await getDocs(collection(db, 'walkable_paths'));
        if (snapshot.empty) {
            console.error('No walkable paths document found');
            return {};
        }
        let paths = {};
        snapshot.forEach(doc => {
            paths[doc.id] = doc.data();
        });
        return paths;
    } catch (error) {
        console.error('Error fetching walkable paths:', error);
        return {};
    }
};

export const fetchNonWalkablePaths = async () => {
    try {
        const snapshot = await getDocs(collection(db, 'non_walkable_paths'));
        if (snapshot.empty) {
            console.error('No non-walkable paths document found');
            return {};
        }
        let paths = {};
        snapshot.forEach(doc => {
            paths[doc.id] = doc.data();
        });
        return paths;
    } catch (error) {
        console.error('Error fetching non-walkable paths:', error);
        return {};
    }
};

export const fetchStartPoint = async () => {
    const data = await fetchDocumentData('paths/stBuilding');
    return data ? data.startPoint : { x: 0, y: 0 };
};

export const savePathsToFirestore = async (walkablePaths, nonWalkablePaths, startPoint) => {
    const newPathsData = {
        walkable: walkablePaths,
        nonWalkable: nonWalkablePaths,
        startPoint: startPoint
    };

    try {
        const pathsDocRef = doc(db, 'paths', 'stBuilding');
        await setDoc(pathsDocRef, newPathsData);
    } catch (e) {
        console.error("Error saving paths to Firestore:", e);
    }
};

export { db };
