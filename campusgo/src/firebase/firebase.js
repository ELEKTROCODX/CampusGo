import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
import { getFunctions } from 'firebase/functions';
import { toast } from 'react-toastify'; // 1. Importa toast

// Configuración de Firebase (leyendo de .env)
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

// Inicialización de servicios
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export const db = getFirestore(app);
export const functions = getFunctions(app,'us-central1');

// --- INICIO DE LÓGICA DE TIMEOUT (PLAN B) ---

// 2. Función de ayuda que crea una promesa de "timeout"
const createTimeout = (ms, message) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, ms);
  });
};

// 3. Función real de registro (la que se trababa)
async function registerAndGetToken() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Permiso de notificación denegado.");
    return { success: false, token: null };
  }

  const swPath = "/duca/firebase-messaging-sw.js";
  const scope = "/duca/";
  
  console.log("Registrando SW en:", swPath, "con scope:", scope);
  await navigator.serviceWorker.register(swPath, { scope: scope });
  
  console.log("Esperando a que el Service Worker esté 'ready'...");
  // Esta es la línea que se traba:
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
    return { success: true, token: fcmToken };
  } else {
    console.log("No se pudo generar el token.");
    return { success: false, token: null };
  }
}

// 4. Función exportada que USA la carrera (Promise.race)
export const generateToken = async () => {
  try {
    // Ejecuta la función real y el temporizador al mismo tiempo
    const result = await Promise.race([
      registerAndGetToken(),
      createTimeout(10000, 'El registro del Service Worker tardó demasiado (10s).') // Temporizador de 5 segundos
    ]);
    
    return result; // Devuelve el resultado si 'registerAndGetToken' gana

  } catch (error) {
    // Esto se ejecuta si el TEMPORIZADOR de 5 segundos gana
    console.error("Error detallado al generar el token (Timeout):", error.message);
    
    // 5. ¡TU LÓGICA!
    toast.error("Error al activar notificaciones. Inténtalo de nuevo."); 
    
    // Espera 2 segundos para que se vea el toast y recarga
    setTimeout(() => window.location.reload(), 6000); 

    return { success: false, token: null };
  }
};