// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDS0uydAjWWfHze8SMPvCx67I9LolmnzUw",
    authDomain: "ship-swift-a939f.firebaseapp.com",
    projectId: "ship-swift-a939f",
    storageBucket: "ship-swift-a939f.firebasestorage.app",
    messagingSenderId: "120786095801",
    appId: "1:120786095801:web:55d7506f600203335c1568",
    measurementId: "G-ZKTDRH012J"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});