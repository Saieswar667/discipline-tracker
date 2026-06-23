importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCyF7yUrq_QaaT5v3_oUEE1hk7ERz8400E",
  authDomain: "discipline-tracker-63c38.firebaseapp.com",
  projectId: "discipline-tracker-63c38",
  storageBucket: "discipline-tracker-63c38.firebasestorage.app",
  messagingSenderId: "213877700807",
  appId: "1:213877700807:web:311c995f3ce5d1f682a6e2",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload.notification?.title || "🔥 Discipline Reminder";

  const notificationOptions = {
    body: payload.notification?.body || "Complete your habits.",
    icon: "/icon-192.png",
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});