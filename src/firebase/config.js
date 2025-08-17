import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAUhqd59WW0KGSqbpV55e1M07aDdn3kgsM",
  authDomain: "distance-monitoring-5bde4.firebaseapp.com",
  databaseURL:
    "https://distance-monitoring-5bde4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "distance-monitoring-5bde4",
  storageBucket: "distance-monitoring-5bde4.appspot.com",
  messagingSenderId: "1071970439663",
  appId: "1:1071970439663:web:b1abf7e57726f9bcbe661a",
  measurementId: "G-X9TKK5NMQH",
};

console.log("🔥 Firebase Config:", firebaseConfig);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
