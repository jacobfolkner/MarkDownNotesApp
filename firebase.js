// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_zW_x2Wnp4BbXoD9C2HGn5PgMcF6lLUI",
  authDomain: "react-notes-dd2dd.firebaseapp.com",
  projectId: "react-notes-dd2dd",
  storageBucket: "react-notes-dd2dd.appspot.com",
  messagingSenderId: "261245123792",
  appId: "1:261245123792:web:ec334807f611cb857972d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");