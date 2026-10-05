// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS0uydAjWWfHze8SMPvCx67I9LolmnzUw",
  authDomain: "ship-swift-a939f.firebaseapp.com",
  projectId: "ship-swift-a939f",
  storageBucket: "ship-swift-a939f.firebasestorage.app",
  messagingSenderId: "120786095801",
  appId: "1:120786095801:web:55d7506f600203335c1568",
  measurementId: "G-ZKTDRH012J",
};

// Initialize Firebase
let app: any;
let analytics: any;
let messaging: any;

if (typeof window !== "undefined") {
  try {
    // Initialize Firebase only in the client
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    // Initialize Firebase Cloud Messaging and get a reference to the service
    messaging = getMessaging(app);
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    app = null;
    analytics = null;
    messaging = null;
  }
}

export { app, analytics, messaging };
