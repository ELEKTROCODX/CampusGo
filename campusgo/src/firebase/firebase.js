import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
import { getFunctions } from 'firebase/functions';

// --- PASO 1: FALTA ESTA PARTE ---
// Lee la configuración desde el archivo .env
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// --- PASO 2: FALTA ESTA LÍNEA ---
// Inicializa 'app'
const app = initializeApp(firebaseConfig);

// --- TU CÓDIGO (AHORA FUNCIONARÁ) ---
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export const db = getFirestore(app);
export const functions = getFunctions(app,'us-central1');

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Permiso de notificación denegado.");
      return { success: false, token: null }; // <-- DEVUELVE OBJETO
    }
    const swPath = "/duca/firebase-messaging-sw.js";
    const scope = "/duca/";
    console.log("Registrando SW en:", swPath, "con scope:", scope);
    await navigator.serviceWorker.register(swPath, { scope: scope });
    console.log("Esperando a que el Service Worker esté 'ready'...");
    const registration = await navigator.serviceWorker.ready;
    console.log("Service Worker está 'ready':", registration);
    const vapidKey = process.env.REACT_APP_VAPID_KEY;
    if (!vapidKey) {
        console.error("Error: REACT_APP_VAPID_KEY no definida en .env");
        return { success: false, token: null };
    }
    console.log("Intentando obtener token...");
    const fcmToken = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      vapidKey: vapidKey, 
    });
    if (fcmToken) {
      console.log("Token generado con éxito:", fcmToken);
      localStorage.setItem("fcmToken", fcmToken);
      return { success: true, token: fcmToken }; // <-- DEVUELVE OBJETO
    } else {
      console.log("No se pudo generar el token.");
      return { success: false, token: null };
    }
  } catch (error) {
    console.error("Error detallado al generar el token:", error);
    return { success: false, token: null };
  }
};