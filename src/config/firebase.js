import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBT93hmr81TT_-KltaYxcYwms_xKxg3c1I",
    authDomain: "medivend-a3d51.firebaseapp.com",
    projectId: "medivend-a3d51",
    storageBucket: "medivend-a3d51.firebasestorage.app",
    messagingSenderId: "743343498567",
    appId: "1:743343498567:web:2d50fb42346f31350d1862"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
