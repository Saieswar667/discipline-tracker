import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCyF7yUrq_QaaT5v3_oUEE1hk7ERz8400E",
  authDomain: "discipline-tracker-63c38.firebaseapp.com",
  projectId: "discipline-tracker-63c38",
  storageBucket: "discipline-tracker-63c38.firebasestorage.app",
  messagingSenderId: "213877700807",
  appId: "1:213877700807:web:311c995f3ce5d1f682a6e2",
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "BFPmo8fCAuQUxPKbmwt7f7q2SvW41agL09v6F3TtDNNLPtUH5NruFwO_KwuxBKxzVSdKhCXXGLvfZ2MeYr4fL6g",
    });
console.log("FCM TOKEN:", token);

if (!token) {
  alert("No FCM token generated. Check service worker or VAPID key.");
  return null;
}

alert("FCM TOKEN:\n" + token);

    return token;
  } catch (error) {
    console.error(error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });