import { initializeApp } from 'firebase/app';
import { initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDKpEpmJHNUdEERPaVypy7p1St4DgF2Q8Y",
    authDomain: "billpilot-lisorthman.firebaseapp.com",
    projectId: "billpilot-lisorthman",
    storageBucket: "billpilot-lisorthman.firebasestorage.app",
    messagingSenderId: "78541988864",
    appId: "1:78541988864:web:429fb6d29b7e4c8f3da4e5",
    measurementId: "G-RM6RS4KRZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication with local persistence
// indexedDBLocalPersistence works in React Native/Expo environments
const auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
