const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// ESTA FUNCIÓN AHORA ES HTTPS CALLABLE
// Recibe el 'token' y el 'topic' directamente desde la aplicación de React.
exports.subscribeUserToTopicCallable = functions.https.onCall(async (data, context) => {
    // 1. Verificar autenticación (práctica recomendada para funciones Callable)
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Solo usuarios autenticados pueden llamar a esta función.');
    }

    // Espera 'token' (singular string) y 'topic' del payload del cliente.
    const { token, topic, userId } = data; 

    // --- LOG DE DIAGNÓSTICO ---
    const logUserId = context.auth?.uid || userId || 'Anon'; 
    console.log(`[START-CALLABLE] Invocación recibida para el usuario: ${logUserId}`);
    console.log(`Datos recibidos: Token: ${token ? 'Presente' : 'Ausente'}, Tema: ${topic}`);
    // -------------------------

    // 2. Validación de datos
    if (!token || typeof token !== 'string' || token.length === 0 || !topic) {
        console.log("No hay token (o no es string) o tema para suscribir. Terminando Callable.");
        return { success: true, message: "No se requirió suscripción." };
    }

    try {
        // 3. Suscripción al tema
        // admin.messaging().subscribeToTopic acepta un string (token singular).
        const response = await admin.messaging().subscribeToTopic(token, topic);
        
        console.log(`[SUCCESS] Éxito al suscribir el token al tema ${topic}.`);
        
        if (response.failureCount > 0) {
            console.error("Fallo al suscribir el token:", response.errors);
        }

        return { success: true, message: "Suscripción a tema completada.", response: response };

    } catch (error) {
        console.error("[ERROR] Error general al intentar suscribir:", error);
        // Lanza un error de HTTPS para que el cliente lo pueda capturar
        throw new functions.https.HttpsError('internal', 'Fallo al procesar la suscripción.', error.message);
    }
});