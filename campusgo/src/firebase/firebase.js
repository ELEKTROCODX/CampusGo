import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

// Accessing environment variables using process.env
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

const urlBase64ToUint8Array = (base64String) => {
    // Reemplaza caracteres URL-safe y rellena
    const base64 = base64String
        .replace(/-/g, '+') // Cambia '-' por '+'
        .replace(/_/g, '/'); // Cambia '_' por '/'
    
    // Asegura el relleno Base64 (padding)
    const base64Padded = base64.length % 4 === 0 
        ? base64 
        : base64 + '='.repeat(4 - (base64.length % 4));

    // Decodifica la cadena Base64 estándar
    const rawData = window.atob(base64Padded);
    
    // Crea el Uint8Array
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export const db = getFirestore(app);

export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    console.log(permission);
    
    if(permission === "granted"){
            const vapidKey = process.env.REACT_APP_VAPID_KEY;
            console.log("vapid:",vapidKey);
        const token = await getToken(messaging, {
            vapidKey: ""
        });
        
        console.log(token);
        localStorage.setItem('fcmToken', token); 
        return true;
    } else {
        return false;
    }
}

