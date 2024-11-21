// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1V1gEpOsv_ODrxkuZbrb1TNrftkfPKrg",
  authDomain: "blogapp-d62cf.firebaseapp.com",
  projectId: "blogapp-d62cf",
  storageBucket: "blogapp-d62cf.firebasestorage.app",
  messagingSenderId: "527056407539",
  appId: "1:527056407539:web:aa7f43a70455d74a87a086",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
