import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
import { getFunctions } from 'firebase/functions';
import { toast } from 'react-toastify';

// La configuración de Firebase DEBE estar disponible
const firebaseConfig = {
    // ... Tu configuración actual
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
export const functions = getFunctions(app, 'us-central1');

/**
 * Registra el Service Worker, espera a que esté activo y obtiene el token de FCM.
 * @returns {object} { success: boolean, token: string | null }
 */
export const generateToken = async () => {
    // 1. Verificar soporte
    if (!messaging) {
        console.warn("FCM: Messaging no inicializado (puede ser un entorno no seguro/incompatible).");
        return { success: false, token: null };
    }
    
    // 2. OPTIMIZACIÓN CLAVE: Verificar si el token ya existe en localStorage
    const cachedToken = localStorage.getItem("fcmToken");
    if (cachedToken) {
        console.log("FCM: Token encontrado en localStorage. Devolución instantánea.");
        return { success: true, token: cachedToken };
    }
    
    console.log("FCM: INICIO de la solicitud de token (Token no encontrado en caché).");

    const swPath = "/duca/firebase-messaging-sw.js";
    const scope = "/duca/";

    try {
        const registration = await navigator.serviceWorker.register(swPath, { scope: scope });
        
        console.log(`FCM: Service Worker registrado/recuperado en scope: ${registration.scope}`);

        const vapidKey = process.env.REACT_APP_VAPID_KEY;
        if (!vapidKey) {
            console.error("FCM: Error: REACT_APP_VAPID_KEY no definida. Verifica el archivo .env.");
            return { success: false, token: null };
        }

        const fcmToken = await getToken(messaging, {
            serviceWorkerRegistration: registration,
            vapidKey: vapidKey,
        });
        console.log("FCM TOKEN OBTENIENDO...")

        // 5. Manejo del resultado
        if (fcmToken) {
            localStorage.setItem("fcmToken", fcmToken);
            console.log("FCM: Proceso COMPLETO exitoso. Token generado.");
            return { success: true, token: fcmToken };
        } else {
            // Esto ocurre si el permiso se deniega después de la solicitud implícita de getToken
            console.warn("FCM: Permiso de notificación denegado durante getToken o token no generado.");
            return { success: false, token: null };
        }
    } catch (error) {
        // Manejo de errores de red, seguridad, registro de SW, o si el usuario deniega el permiso
        console.error("FCM: Error grave durante la generación de token:", error);
        
        // Comprobación de permiso denegado explícito
        const permission = Notification.permission;
        if (permission === 'denied') {
            console.warn("FCM: El usuario ha denegado el permiso de notificación permanentemente.");
        }
        
        return { success: false, token: null };
    }
}