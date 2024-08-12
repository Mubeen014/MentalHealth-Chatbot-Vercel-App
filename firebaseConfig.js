// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjQxZrDX4QOEn-u3EslOyf7ZB0E90zlVc",
  authDomain: "chatbot-database-91a19.firebaseapp.com",
  projectId: "chatbot-database-91a19",
  storageBucket: "chatbot-database-91a19.appspot.com",
  messagingSenderId: "475629704026",
  appId: "1:475629704026:web:02ccfe0a5a79ca10d2d963",
  measurementId: "G-QFKL4SH73G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


