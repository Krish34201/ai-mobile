// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCljK30w63Ef9UcSQaiAtTwnOt5YJyCfsk",
  authDomain: "studio-9664478551-b17ac.firebaseapp.com",
  projectId: "studio-9664478551-b17ac",
  storageBucket: "studio-9664478551-b17ac.firebasestorage.app",
  messagingSenderId: "871856870253",
  appId: "1:871856870253:web:68eed8301a20b616658064"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export { app };
