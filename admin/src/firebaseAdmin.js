import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAUBxMULCA2O9L8cpO0RV7kaD_dzMnUrjY",
  authDomain: "tippulse.firebaseapp.com",
  projectId: "tippulse",
  storageBucket: "tippulse.firebasestorage.app",
  messagingSenderId: "451997794469",
  appId: "1:451997794469:web:8dbeb4dd4ae72619e40d4c",
  measurementId: "G-0XJV2VLZ07"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
