import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Importa SOLO getMessaging de 'firebase/messaging' aquí
import { getMessaging } from "firebase/messaging"; 
import { getFunctions } from 'firebase/functions';

// Importa getToken por separado para usarlo en la función
import { getToken } from "firebase/messaging"; 

// Tu configuración de Firebase (sin cambios)
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

// Inicialización (sin cambios)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export const db = getFirestore(app);
export const functions = getFunctions(app,'us-central1');

// --- REEMPLAZA TU generateToken CON ESTA VERSIÓN ---

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Permiso de notificación:", permission); // Log para depurar

    if (permission === "granted") {
      
      // 1. Ruta CORRECTA del service worker
      const swPath = "/duca/firebase-messaging-sw.js";

      // 2. Registra el service worker manualmente
      console.log("Intentando registrar SW en:", swPath); // Log
      const registration = await navigator.serviceWorker.register(swPath, {
        scope: "/duca/", 
      });
      console.log("SW registrado con éxito:", registration); // Log

      // 3. Obtén la VAPID key desde .env
      const vapidKey = process.env.REACT_APP_VAPID_KEY;
      if (!vapidKey) {
          console.error("Error: REACT_APP_VAPID_KEY no está definida en .env");
          return false;
      }
      console.log("Usando VAPID Key."); // Log (No mostrar la key)

      // 4. Pasa el registro a getToken()
      console.log("Intentando obtener token..."); // Log
      const fcmToken = await getToken(messaging, {
        serviceWorkerRegistration: registration,
        vapidKey: vapidKey, 
      });

      if (fcmToken) {
        console.log("Token generado con éxito:", fcmToken);
        localStorage.setItem("fcmToken", fcmToken);
        return true; // Éxito
      } else {
        console.log("No se pudo generar el token. Asegúrate que la VAPID key es correcta.");
        return false; // Fallo
      }
    } else {
      console.log("Permiso de notificación denegado.");
      return false; // Fallo
    }
  } catch (error) {
    // Loguea errores específicos del registro o getToken
    console.error("Error detallado al generar el token:", error); 
    if (error.code === 'messaging/failed-service-worker-registration') {
        console.error("Detalle: Fallo al registrar el Service Worker. Verifica la ruta y el scope.");
    } else if (error.code === 'messaging/invalid-vapid-key') {
         console.error("Detalle: La VAPID key es inválida o no está configurada correctamente en Firebase.");
    }
    return false; // Fallo
  }
};