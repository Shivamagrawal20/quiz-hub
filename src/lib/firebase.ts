import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjxJMzThwyJX0wCt3uUgwWKG-wnqIZhQE",
  authDomain: "examfify.firebaseapp.com",
  projectId: "examfify",
  storageBucket: "examfify.firebasestorage.app",
  messagingSenderId: "285864874257",
  appId: "1:285864874257:web:6794ec37358d2ba63c7cb0",
  measurementId: "G-54JF5K3HYV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);