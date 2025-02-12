// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDtNedkJo6ikNneZZdrheiWbE3Dn2B8kwQ",
    authDomain: "ces-project-f8b4e.firebaseapp.com",
    databaseURL: "https://ces-project-f8b4e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ces-project-f8b4e",
    storageBucket: "ces-project-f8b4e.firebasestorage.app",
    messagingSenderId: "580767851656",
    appId: "1:580767851656:web:2c852e7edb81a6decdeb3d",
    measurementId: "G-K73DSMWBTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore Collection Name
const MEMORY_COLLECTION = "genesis";

/**
 * Save a conversation message to Firestore.
 * @param {string} userId - The user identifier.
 * @param {string} message - The conversation text.
 * @returns {Promise<void>}
 */
export async function saveMemory(userId, message) {
    try {
        const docRef = await addDoc(collection(db, MEMORY_COLLECTION), {
            userId: userId,
            message: message,
            timestamp: serverTimestamp() // Firestore auto-generates timestamp
        });
        console.log("✅ Memory saved:", docRef.id);
    } catch (error) {
        console.error("❌ Error saving memory:", error);
    }
}

/**
 * Retrieve past conversation history from Firestore.
 * @param {number} limitResults - Number of messages to retrieve.
 * @returns {Promise<Array>} - Returns an array of memory messages.
 */
export async function getMemory(limitResults = 10) {
    try {
        const q = query(
            collection(db, MEMORY_COLLECTION),
            orderBy("timestamp", "desc") // Sort messages by date (latest first)
        );

        const querySnapshot = await getDocs(q);
        let messages = [];

        querySnapshot.forEach((doc) => {
            let data = doc.data();
            let formattedDate = data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString() : "No Date";
            messages.push({ id: doc.id, ...data, created_at: formattedDate });
        });

        return messages;
    } catch (error) {
        console.error("❌ Error retrieving memory:", error);
        return [];
    }
}

/**
 * Listen to real-time updates from Firestore.
 * @param {Function} callback - Function to execute when data changes.
 */
export function listenToMemory(callback) {
    const q = query(
        collection(db, MEMORY_COLLECTION),
        orderBy("timestamp", "desc")
    );

    onSnapshot(q, (querySnapshot) => {
        let messages = [];

        querySnapshot.forEach((doc) => {
            let data = doc.data();
            let formattedDate = data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString() : "No Date";
            messages.push({ id: doc.id, ...data, created_at: formattedDate });
        });

        callback(messages);
    });
}