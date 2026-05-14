import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-u9UY4MRkhBY_cz0An3SmzcjXQNWgVS8",
  authDomain: "ai-interview-preparation-31cb5.firebaseapp.com",
  projectId: "ai-interview-preparation-31cb5",
  storageBucket: "ai-interview-preparation-31cb5.firebasestorage.app",
  messagingSenderId: "188705576970",
  appId: "1:188705576970:web:6691e3982e3f394697e7f3",
  measurementId: "G-M704TLMYZY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();