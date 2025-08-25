import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZOH18yEJr80qrZa028xu2ZW8ntYjep-M",
  authDomain: "osvan-a0589.firebaseapp.com",
  projectId: "osvan-a0589",
  storageBucket: "osvan-a0589.firebasestorage.app",
  messagingSenderId: "357247107529",
  appId: "1:357247107529:web:4ae0c90e327ca00e226818"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export { app };
export default firebaseConfig;
