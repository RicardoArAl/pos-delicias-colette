import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDkAN6T1VKF4_1gwiT806qklN_ZU6Q5EYs",
  authDomain: "delicias-colette-pos.firebaseapp.com",
  projectId: "delicias-colette-pos",
  storageBucket: "delicias-colette-pos.firebasestorage.app",
  messagingSenderId: "771712476989",
  appId: "1:771712476989:web:17866e36053f991b678754"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

export { db };