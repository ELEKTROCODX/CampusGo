import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPage.css";
import Sticker1 from "../assets/stickers/elemento1.png";
import { generateToken, db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import FormLayout from "../layouts/FormLayout/FormLayout";
import Modal from "../components/Modal/Modal";
import Footer from "../components/Footer/Footer";
import { toast } from "react-toastify";
import { isIosSafari } from "../utils/functions";
import { logToFirestore } from "../utils/logger"; // Importar el helper de logging

const infoSound = "/duca/sounds/noti.mp3";

// Crea una función de ayuda para reproducir el sonido
const playSound = (soundFile) => {
    try {
        const audio = new Audio(soundFile);
        audio.play().catch(e => console.warn("No se pudo reproducir el sonido:", e));
    } catch (e) {
        console.error("Error al crear el objeto Audio:", e);
    }
};

// Función para manejar el éxito de la suscripción (usada para evitar código repetido)
const handleSubscriptionSuccess = async (navigate, userLog, playerId) => {
    playSound(infoSound);
    toast.success("¡Permiso aceptado!");

    if (userLog && playerId) {
        try {
            const userRef = doc(db, "Usuarios", userLog);
            await updateDoc(userRef, { osPlayerId: playerId });
            logToFirestore("Firestore Update", "osPlayerId actualizado en Firestore.", { playerId, userLog });
        } catch (error) {
            logToFirestore("Firestore Error", "Error al actualizar osPlayerId en Firestore.", { error: error.message, playerId });
            console.warn("Error (no crítico) al actualizar el token en Firestore:", error);
        }
    } else {
        logToFirestore("User Data Missing", "Suscripción exitosa, pero falta userLog para guardar ID.", { playerId, userLog });
    }

    navigate("/subscribe");
};


function FormPage() {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const userLog = localStorage.getItem('userLog');
    const [loading, setLoading] = useState(false);
    // showReloadOption no se usa en el código, pero lo dejo por si acaso
    // eslint-disable-next-line no-unused-vars
    const [showReloadOption] = useState(false); 
    
    const handleManualReload = () => {
        toast.info("Reiniciando la página para completar la activación...");
        window.location.reload();
    };
    
    const handlePermission = async () => {
        if (loading) return;

        setShowModal(false);
        setLoading(true);

        try {
            if (isIosSafari()) {
                toast.success("ES IOS");
                console.log("Es iOS/Safari. Usando OneSignal.");
                logToFirestore("Detection", "Identificado como iOS/Safari. Iniciando OneSignal.");

                // 1. Esperar a que el SDK de OneSignal esté listo
                await new Promise((resolve) => {
                    const check = () => {
                        if (window.OneSignal && window.OneSignal.push) return resolve();
                        setTimeout(check, 100);
                    };
                    check();
                });

                window.OneSignal.push(function () {
                    
                    // --- HABILITAR LOGGING DETALLADO PARA DEPURACIÓN ---
                    window.OneSignal.Debug.setLogLevel('VERBOSE'); 
                    logToFirestore("OneSignal Debug", "Nivel de log Verbose habilitado.");
                    // --------------------------------------------------

                    // 2. Inicialización
                    window.OneSignal.init({
                        appId: process.env.REACT_APP_ONESIGNAL_APPID,
                        safari_web_id: process.env.REACT_APP_ONESIGNAL_SAFARI_WEB_ID,
                        allowLocalhostAsSecureOrigin: true,
                    });
                    logToFirestore("OneSignal Init", "SDK inicializado con IDs del entorno.");

                    // 3. Mostrar el prompt de permisos
                    window.OneSignal.showSlidedownPrompt();
                    logToFirestore("OneSignal Prompt", "Slidedown prompt mostrado.");

                    // 4. Listener de cambio de suscripción
                    window.OneSignal.on('subscriptionChange', function (isSubscribed) {
                        console.log("Estado de suscripcion", isSubscribed);
                        if (isSubscribed) {
                            window.OneSignal.User.get().getId().then(playerId => {
                                logToFirestore("OneSignal Success", "Player ID obtenido con éxito.", { playerId, userLog });
                                handleSubscriptionSuccess(navigate, userLog, playerId); 
                            });
                        } else {
                            // El usuario denegó o canceló la suscripción
                            logToFirestore("OneSignal Denied", "Suscripción denegada por el usuario.");
                            toast.error("Permiso de notificación denegado en Safari.");
                            navigate("/form"); 
                        }
                        setLoading(false); 
                    });
                    
                    // 5. Comprobar si ya estaba suscrito (útil después de recargas)
                    window.OneSignal.User.get().then(user => {
                        if (user && user.subscriptionId) {
                            console.log("Ya estaba suscrito.");
                            logToFirestore("OneSignal Check", "Usuario ya suscrito, Player ID existente.", { playerId: user.subscriptionId, userLog });
                            handleSubscriptionSuccess(navigate, userLog, user.subscriptionId);
                        } else {
                             logToFirestore("OneSignal Check", "No estaba suscrito previamente o ID no encontrado.", { userLog });
                        }
                    }).catch(err => {
                        logToFirestore("OneSignal Check Error", "Error al verificar suscripción inicial.", { error: err.message });
                    });
                    
                    setLoading(false); // Detenemos la carga después de configurar listeners
                });
            } else {
                toast.success("NOOO ES IOS");
                console.log("No es ios. Usando Firebase.");
                logToFirestore("Detection", "Identificado como NO iOS/Safari. Usando Firebase FCM.");
                
                const result = await generateToken();

                if (result.reload) {
                    playSound(infoSound);
                    toast.info("Activando servicio de notificaciones...");
                    logToFirestore("FCM Reload", "Se necesita recarga para Service Worker de Firebase.");
                    setTimeout(() => window.location.reload(), 2000);
                    setLoading(false); 
                    return;
                }

                if (result.success) {
                    playSound(infoSound);
                    toast.success("¡Permiso aceptado! Token guardado.");
                    logToFirestore("FCM Success", "Token de Firebase generado con éxito.", { token: result.token.substring(0, 20) + '...' });

                    if (userLog && result.token) { 
                        try {
                            const userRef = doc(db, "Usuarios", userLog);
                            await updateDoc(userRef, { fcmToken: result.token });
                            logToFirestore("Firestore Update", "fcmToken actualizado en Firestore.", { userLog });
                        } catch (error) {
                            logToFirestore("Firestore Error", "Error al actualizar fcmToken en Firestore.", { error: error.message });
                            console.warn("Error (no crítico) al actualizar el token en Firestore:", error);
                        }
                    } else if (!userLog) {
                        logToFirestore("FCM Log", "Permiso otorgado. Continuar a registro (token en localStorage).");
                    }

                    navigate("/subscribe");

                } else {
                    playSound(infoSound);
                    console.error("No se pudo generar el token de notificación.");
                    logToFirestore("FCM Denied", "Permiso de notificación denegado o fallo al generar token.", { error: result.error });
                    toast.error("No se pudo activar el permiso. Inténtalo de nuevo.");
                    navigate("/form");
                }
            }

        } catch (error) {
            playSound(infoSound);
            console.error("Error en handlePermission:", error);
            logToFirestore("Fatal Error", "Error inesperado en handlePermission.", { error: error.message, stack: error.stack });
            toast.error("Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
        }
    };


    const handleSkip = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleConfirmSkip = () => {
        localStorage.removeItem('fcmToken');
        logToFirestore("User Skip", "Usuario decidió saltar el paso de permisos.");
        playSound(infoSound);
        toast.info("Permiso omitido.");
        setShowModal(false);
        navigate("/subscribe");
    };

    if (loading) {
        return (
            <FormLayout>
                <div className="PermissionScreen" style={{ justifyContent: 'center', height: '60vh', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center', marginTop: '1rem' }}>
                        Activando servicio de notificaciones... <br />
                        Estableciendo conexión con Google / OneSignal
                    </h2>
                    <button className="btn btn-outline" onClick={handleManualReload}>
                        Reiniciar la Página
                    </button>
                    <p style={{ color: 'white', opacity: 0.8, textAlign: 'center', margin: '0.5rem 0 2rem' }}>
                        (Esto puede tardar unos segundos <br />
                        Si tarda demasiado, recarga la página)
                    </p>

                    {showReloadOption && (
                        <button className="btn btn-outline" onClick={handleManualReload}>
                            Reiniciar la Página
                        </button>
                    )}
                </div>
            </FormLayout>
        );
    }

    return (
        <FormLayout>
            <div className="PermissionScreen">
                <img src={Sticker1} alt="Icono permisos" className="PermissionScreen__icon" />
                <h2 className="PermissionScreen__title">Activar las notificaciones</h2>
                <div className="PermissionScreen__text-container">
                    <p className="permissionScreen__text">
                        Queremos guiarte en cada momento del evento, por lo que necesitamos tu permiso para enviarte notificaciones en tiempo real.
                    </p>
                </div>
                <button className="btn btn-acento" onClick={handlePermission} disabled={loading}>
                    {"Permitir"}
                </button>
                <div className="PermissionScreen__progress-bottom">
                    <span className="PermissionScreen__skip-text" onClick={handleSkip}>
                        Saltar paso
                    </span>
                </div>
            </div>

            {showModal && (
                <Modal onClose={handleModalClose}>
                    <h3>¿Estás seguro de que deseas no recibir notificaciones?</h3>
                    <p>No podrás disfrutar de la experiencia completa.</p>
                    <div className="PermissionScreen__modal-buttons">
                        <button className="btn btn-acento" onClick={handlePermission} disabled={loading}>Sí, Aceptar</button>
                        <button className="btn btn-outline" onClick={handleConfirmSkip}>No, Omitir</button>
                    </div>
                </Modal>
            )}
            <Footer />
        </FormLayout>
    );
}

export default FormPage;