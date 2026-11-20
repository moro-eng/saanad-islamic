// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD18U8IpH6TPrywv5eFE6NVTQw3knE5ybs",
  authDomain: "sanad-islamic-platform.firebaseapp.com",
  projectId: "sanad-islamic-platform",
  storageBucket: "sanad-islamic-platform.firebasestorage.app",
  messagingSenderId: "405532961652",
  appId: "1:405532961652:web:35ae5bdb58186c9debda21",
  measurementId: "G-Z9DVBS1LB4"
};

export const OWNER_EMAIL = "alim22e13@gmail.com";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);