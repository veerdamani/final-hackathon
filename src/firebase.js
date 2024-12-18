import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLmq-dFEpgLuC0rPpfHgIm-WO1zz2d4rI",
  authDomain: "final-hackathon-1424d.firebaseapp.com",
  projectId: "final-hackathon-1424d",
  storageBucket: "final-hackathon-1424d.firebasestorage.app",
  messagingSenderId: "216897150167",
  appId: "1:216897150167:web:d633930dd72a1c190fe492"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const database = getDatabase();

export { auth , db , database }