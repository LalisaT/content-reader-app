import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  memoryLocalCache
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAUBxMULCA2O9L8cpO0RV7kaD_dzMnUrjY",
  authDomain: "tippulse.firebaseapp.com",
  projectId: "tippulse",
  storageBucket: "tippulse.firebasestorage.app",
  messagingSenderId: "451997794469",
  appId: "1:451997794469:web:8dbeb4dd4ae72619e40d4c",
  measurementId: "G-0XJV2VLZ07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Pure Live Remote Architecture: In-memory transient cache only, no IndexedDB/disk persistence
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache()
});

export default app;
