const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Inicializa el SDK de Admin. Esto le da acceso a la base de datos y a Messaging.
admin.initializeApp();

/**
 * Función que se dispara cada vez que se crea un nuevo documento
 * en la colección 'Usuarios'.
 * Lee el token de FCM y el tema asignado y suscribe el token al tema.
 */
exports.subscribeUserToTopic = functions.firestore
    .document('Usuarios/{userId}')
    .onCreate(async (snap, context) => {
        const userData = snap.data();
        
        // Verifica si existe el tema asignado (topic)
        const topic = userData.topic;
        
        // Verifica si existe un token de FCM en el primer elemento del array fcmTokens
        // Usamos el operador ternario para asegurarnos que userData.fcmTokens no sea nulo antes de acceder a [0]
        const token = (userData.fcmTokens && userData.fcmTokens.length > 0) 
            ? userData.fcmTokens[0] 
            : null;

        if (topic && token) {
            try {
                // LLAMADA SEGURA: Suscribe el token al tema de FCM
                await admin.messaging().subscribeToTopic(token, topic);
                console.log(`[EXITO] Token ${token} suscrito a tema: ${topic}`);
            } catch (error) {
                console.error(`[ERROR] Falló la suscripción al tema ${topic} para el token ${token}:`, error);
            }
        } else {
            console.log(`Omite suscripción: Token (${!!token}) o Tema (${!!topic}) faltante.`);
        }
        
        // Siempre debe retornar un valor nulo o un Promise resuelto
        return null;
    });
