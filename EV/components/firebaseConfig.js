// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMFkjAPHtCMiiQRJmkMt0qlQTUvnKQ2L4",
  authDomain: "ecovoyage-e2741.firebaseapp.com",
  projectId: "ecovoyage-e2741",
  storageBucket: "ecovoyage-e2741.firebasestorage.app",
  messagingSenderId: "315418324",
  appId: "1:315418324:web:13bbb7995ddeef5583fd41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);