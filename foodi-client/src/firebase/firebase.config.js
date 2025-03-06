// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0p1rDtzK8H4f7M68AIfsN8WrjEkHmElY",
  authDomain: "foodi-web.firebaseapp.com",
  projectId: "foodi-web",
  storageBucket: "foodi-web.firebasestorage.app",
  messagingSenderId: "562531203607",
  appId: "1:562531203607:web:05745cf44afca44eceba52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;