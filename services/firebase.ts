
// Fixed: Using modern modular Firebase v9 SDK to avoid "Property 'auth' does not exist" errors
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration placeholders
// Note: In a production environment, these would be managed via environment variables.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "breaktheloop-auth.firebaseapp.com",
  projectId: "breaktheloop-auth",
  storageBucket: "breaktheloop-auth.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Fixed: Correct initialization and auth retrieval for v9 modular SDK
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
