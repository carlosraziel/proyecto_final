// Importamos las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCi6mwKqXu93j6G5kId9pDEwnU8e2nqLYk",
  authDomain: "panaderia-el-oaxaqueno.firebaseapp.com",
  projectId: "panaderia-el-oaxaqueno",
  storageBucket: "panaderia-el-oaxaqueno.firebasestorage.app",
  messagingSenderId: "1019129480371",
  appId: "1:1019129480371:web:072bc52333f60adabfdcc6"
};
// Inicializamos la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Exportamos la Base de Datos y la Autenticación para usarlas en otras pantallas
export const db = getFirestore(app);
export const auth = getAuth(app);