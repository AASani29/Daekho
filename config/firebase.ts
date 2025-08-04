import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyC3hZVg-wuTq7F6AKyei-7hyAoXZqstdUA",
  authDomain: "daekho-553a9.firebaseapp.com",
  projectId: "daekho-553a9",
  storageBucket: "daekho-553a9.firebasestorage.app",
  messagingSenderId: "813896712651",
  appId: "1:813896712651:web:63a0672f9f55b2912bb64e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const firestore = getFirestore(app);

export { auth, firestore, app };
