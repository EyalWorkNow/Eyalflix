
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsIsSupported } from 'firebase/analytics';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  type User
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCbLawHmdst6CGGn-DdsBDcl-Y3GoMQtE8",
  authDomain: "eyalflix.firebaseapp.com",
  projectId: "eyalflix",
  storageBucket: "eyalflix.firebasestorage.app",
  messagingSenderId: "121091609162",
  appId: "1:121091609162:web:fb196a0b095cb776374cb3",
  measurementId: "G-N2KGY49SZ3"
};

export const app = initializeApp(firebaseConfig);

let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  analyticsIsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    analytics = null;
  });
}
export { analytics };

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider
};

export type { User };
