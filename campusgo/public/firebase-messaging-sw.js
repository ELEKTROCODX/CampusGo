importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAIkCpPpVAiIWROK1s7I3dDjJkS3jEj1WI",
    authDomain: "prueba-noti-2db31.firebaseapp.com",
    databaseURL: "https://prueba-noti-2db31-default-rtdb.firebaseio.com",
    projectId: "prueba-noti-2db31",
    storageBucket: "prueba-noti-2db31.firebasestorage.app",
    messagingSenderId: "437866471554",
    appId: "1:437866471554:web:b04a9d04e9809009b3949b",
    measurementId: "G-X3EL2XX0QJ",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Mensaje en segundo plano recibido ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '../favicon.ico'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});