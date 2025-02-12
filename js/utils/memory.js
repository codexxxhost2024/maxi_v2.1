// js/utils/memory.js

// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Firebase Config (Using Your Provided Credentials)
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
 * Save a conversation memory to Firestore.
 * @param {string} userId - The user identifier.
 * @param {string} message - The conversation text.
 * @returns {Promise<void>}
 */
export async function saveMemory(userId, message) {
    try {
        const docRef = await addDoc(collection(db, MEMORY_COLLECTION), {
            userId: userId,
            message: message,
            timestamp: new Date().toISOString()
        });
        console.log("✅ Memory saved with ID:", docRef.id);
    } catch (error) {
        console.error("❌ Error saving memory:", error);
    }
}

/**
 * Retrieve conversation history from Firestore.
 * @param {string} userId - The user identifier.
 * @param {number} limitResults - Number of messages to retrieve.
 * @returns {Promise<Array>} - Returns an array of memory messages.
 */
export async function getMemory(userId, limitResults = 10) {
    try {
        const q = query(
            collection(db, MEMORY_COLLECTION),
            where("userId", "==", userId),
            orderBy("timestamp", "desc"),
            limit(limitResults)
        );

        const querySnapshot = await getDocs(q);
        let messages = [];

        querySnapshot.forEach((doc) => {
            messages.push(doc.data());
        });

        return messages;
    } catch (error) {
        console.error("❌ Error retrieving memory:", error);
        return [];
    }
}