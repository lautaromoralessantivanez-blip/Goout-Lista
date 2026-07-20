// ==========================================
// FIREBASE
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "TU_API_KEY",

    authDomain: "goout-lista.firebaseapp.com",

    projectId: "goout-lista",

    storageBucket: "goout-lista.firebasestorage.app",

    messagingSenderId: "64796336383",

    appId: "TU_APP_ID",

    measurementId: "G-K1SB9X5K7B"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {

    db,

    collection,

    addDoc,

    updateDoc,

    deleteDoc,

    doc,

    onSnapshot,

    getDocs

};
