// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJE2afvBJ8dxdeZHXwRopEEkREkjQ1Xwk",
  authDomain: "celestique-eaca7.firebaseapp.com",
  projectId: "celestique-eaca7",
  storageBucket: "celestique-eaca7.appspot.com", // ⚠️ CORRETTO QUI
  messagingSenderId: "597193432986",
  appId: "1:597193432986:web:498765963cc8509929a423",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Export them
export { db, storage };
