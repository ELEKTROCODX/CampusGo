// 1. Usa los scripts V9 "compat" (compatibles). Estos SÍ funcionan.
// (He actualizado a una versión más reciente de v9 compat, pero puedes usar 8.10.0 si prefieres)
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");

// 2. Tu config (estaba bien)
const firebaseConfig = {
  apiKey: "AIzaSyAIkCpPpVAiIWROK1s7I3dDjJkS3jEj1WI",
  authDomain: "prueba-noti-2db31.firebaseapp.com",
  databaseURL: "https://prueba-noti-2db31-default-rtdb.firebaseio.com",
  projectId: "prueba-noti-2db31",
  storageBucket: "prueba-noti-2db31.firebasestorage.app",
  messagingSenderId: "437866471554",
  appId: "1:437866471554:web:b04a9d04e9809009b3949b",
  measurementId: "G-X3EL2XX0QJ"
};

// 3. Inicializa con sintaxis "compat" (idéntica a V8)
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 4. Lógica de fondo (sintaxis "compat" / V8)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje en segundo plano recibido ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // 5. ¡LA RUTA DEL ICONO CORREGIDA!
    // Debe estar en /duca/ porque el scope del SW es /duca/
    icon: '/duca/favicon.ico' 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});