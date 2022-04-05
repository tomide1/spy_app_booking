import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDNmDEMcGhXD2JHMfYL_BUs8Ofr6z-MYs4",
    authDomain: "feature-flag-18c35.firebaseapp.com",
    projectId: "feature-flag-18c35",
    storageBucket: "feature-flag-18c35.appspot.com",
    messagingSenderId: "318270609211",
    appId: "1:318270609211:web:4081b212e70c5f8df9491e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const logInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    // console.log(res);
    console.log(res.user.accessToken);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    // console.log(res);
    console.log(res.user.accessToken);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
    signOut(auth);
};

export {
    auth,
    db,
    logInWithGoogle,
    logInWithEmailAndPassword,
    logout,
};
