import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  signOut as _signOut,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjEOgZtCQbxjuRmSe9xuHExG8sZusvI_s",
  authDomain: "futureq-6ec86.firebaseapp.com",
  projectId: "futureq-6ec86",
  storageBucket: "futureq-6ec86.firebasestorage.app",
  messagingSenderId: "48497408259",
  appId: "1:48497408259:web:ee86e859075917f104d136",
  measurementId: "G-9SWTRBBYKK"
};

const app = initializeApp(firebaseConfig);

let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // analytics can fail in non-browser environments or when blocked
}

const auth = getAuth(app);

export function signUp(email, password) {
  return _createUserWithEmailAndPassword(auth, email, password);
}

export function signIn(email, password) {
  return _signInWithEmailAndPassword(auth, email, password);
}

export function signOut() {
  return _signOut(auth);
}

export { auth, onAuthStateChanged, analytics };
