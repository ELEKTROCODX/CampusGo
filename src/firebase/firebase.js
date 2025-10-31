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
    // 1. OPTIMIZACIÓN CLAVE: Verificar si el token ya existe
    const cachedToken = localStorage.getItem("fcmToken");
    if (cachedToken) {
        console.log("FCM: Token encontrado en localStorage. Devolución instantánea.");
        return { success: true, token: cachedToken };
    }
    
    // Si no está en caché, procedemos con la solicitud costosa
    const startTime = performance.now();
    console.log("FCM: INICIO de la solicitud de token (Token no encontrado en caché).");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        console.log("FCM: Permiso de notificación denegado.");
        toast.info("Permiso denegado para notificaciones.");
        return { success: false, token: null };
    }

    try {
        const swPath = "/duca/firebase-messaging-sw.js";
        const scope = "/duca/";
        let registration;

        // 2. INICIO: Registro y espera de Service Worker (rápido)
        const swRegStart = performance.now();
        console.log(`FCM: Intentando registrar Service Worker en ${swPath} con scope ${scope}`);
        
        registration = await navigator.serviceWorker.register(swPath, { scope: scope });
        
        if (registration.installing) {
            console.log("FCM: Esperando a que el Service Worker pase a activo...");
            await new Promise((resolve) => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'activated') {
                        resolve();
                    }
                });
            });
        }

        const swRegEnd = performance.now();
        console.log(`FCM: Service Worker activo. Duración de activación: ${(swRegEnd - swRegStart).toFixed(2)} ms.`);

        const vapidKey = process.env.REACT_APP_VAPID_KEY;
        if (!vapidKey) {
            console.error("FCM: Error: REACT_APP_VAPID_KEY no definida en .env");
            toast.error("Error de configuración (VAPID Key).");
            return { success: false, token: null };
        }

        // 3. INICIO: Solicitud de Token a Google/FCM (lento, 4.5s)
        const tokenReqStart = performance.now();
        console.log("FCM: INICIO de la solicitud de token a los servidores de Google...");

        const fcmToken = await getToken(messaging, {
            serviceWorkerRegistration: registration,
            vapidKey: vapidKey,
        });
        
        const tokenReqEnd = performance.now();
        console.log(`FCM: FIN de la solicitud de token. Duración: ${(tokenReqEnd - tokenReqStart).toFixed(2)} ms.`);


        if (fcmToken) {
            localStorage.setItem("fcmToken", fcmToken);
            const totalTime = (performance.now() - startTime).toFixed(2);
            console.log(`FCM: Proceso COMPLETO exitoso. Tiempo total: ${totalTime} ms.`);
            return { success: true, token: fcmToken };
        } else {
            console.log("FCM: No se pudo generar el token.");
            toast.error("No se pudo obtener el token de FCM.");
            return { success: false, token: null };
        }
    } catch (error) {
        // Manejo de errores generales (red, seguridad, etc.)
        console.error("FCM: Error grave durante la generación de token:", error);
        toast.error("Error de red o seguridad. Consulte la consola.");
        return { success: false, token: null };
    }
};