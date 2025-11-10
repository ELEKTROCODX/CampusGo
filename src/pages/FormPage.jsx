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
import { checkAndWarnIOSVersion, isIosSafari, isIosNotPwa, isWebView, logToFirestore } from "../utils/functions";
import { isSupported } from "firebase/messaging"
import OneSignal from "react-onesignal";
const infoSound = "/duca/sounds/noti.mp3";

// 2. Crea una función de ayuda para reproducir el sonido
const playSound = (soundFile) => {
  try {
    const audio = new Audio(soundFile);
    audio.play().catch(e => console.warn("No se pudo reproducir el sonido:", e));
  } catch (e) {
    console.error("Error al crear el objeto Audio:", e);
  }
};

function FormPage() {
  const publicUrl = "https://fia.uca.edu.sv/duca";
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const userLog = localStorage.getItem('userLog');
  const [status, setStatus] = useState("Esperando permiso...");
  const [loading, setLoading] = useState(false);
  const [showReloadOption] = useState(false);
  const inAppBrowser = isWebView();
  const iosNeedsPWA = isIosNotPwa();
  const handleManualReload = () => {
    toast.info("Reiniciando la página para completar la activación...");
    //window.location.reload();
    navigate('/');
  };
  const handlePermission = async () => {
    if (loading) return;

    setShowModal(false);
    setLoading(true);

    try {

      if (isIosSafari()) {
        if (isIosNotPwa()) {
          toast.info("En iOS, usa la app desde la pantalla de inicio (PWA) para notificaciones.");
          setLoading(false);
          return;
        }
        if (!checkAndWarnIOSVersion(16,4)){
          toast.info("Versión de iOS no compatible, se requiere 16.4+");
          setLoading(false);
          return;
        }
        toast.info("Usando OneSignal para las notificaiones...");

        if (!window._oneSignalInitialized) {
          await OneSignal.init({
            appId: process.env.REACT_APP_ONESIGNAL_APPID,
            safari_web_id: process.env.REACT_APP_ONESIGNAL_SAFARI_WEB_ID,
            notifyButton: { enable: false },
            allowLocalhostAsSecureOrigin: true,
            serviceWorkerPath: `${publicUrl}/OneSignalSDKWorker.js`,
            serviceWorkerScope: publicUrl || "/",
          });
          window._oneSignalInitialized = true;
        }

        // Solicita permiso y espera a que el estado se asiente
        await OneSignal.Notifications.requestPermission(true);
        const permission = await waitForIosPermissionState(3500);
        console.log("Permission (iOS) detectada:", permission, "| Notification.permission:", typeof Notification !== 'undefined' ? Notification.permission : 'n/a');
        if (permission === "granted") {
          playSound(infoSound);
          toast.success("Permiso concedido");

          let playerId = null;
          try {
            if (OneSignal.User && typeof OneSignal.User.getId === 'function') {
              playerId = await OneSignal.User.getId();
            } else if (typeof OneSignal.getUserId === 'function') {
              playerId = await OneSignal.getUserId();
            }
          } catch (e) {
            console.warn("No se pudo obtener OneSignal User ID:", e);
          }

          if (userLog && playerId) {
            try {
              const userRef = doc(db, "Usuarios", userLog);
              await updateDoc(userRef, { oneSignalId: playerId });
              console.log("OneSignal ID guardado en Firestore.");
            } catch (error) {
              console.warn("Error al guardar OneSignal ID en Firestore:", error);
            }
          }
          setStatus("Permiso otorgado.");
          navigate("/subscribe");
        } else {
          playSound(infoSound);
          toast.error("Permiso de notificación denegado en Safari.");
        }
        return;
      }

      const fcmSupported = await isSupported();
      if (!fcmSupported) {
        toast.info("Este navegador no soporta notificaciones push (FCM).");
        setLoading(false);
        navigate("/subscribe");
        return;
      }

      const result = await generateToken();

      // 6. Lógica anterior: Maneja el ÉXITO
      if (result.success) {
        playSound(infoSound);
        toast.success("¡Permiso aceptado! Token guardado.");

        if (userLog && result.token) { // Si el usuario existe Y tenemos token
          try {
            const userRef = doc(db, "Usuarios", userLog);
            await updateDoc(userRef, { fcmToken: result.token });
            console.log("Token actualizado en Firestore para usuario existente.");
          } catch (error) {
            console.warn("Error (no crítico) al actualizar el token en Firestore:", error);
          }
        } else if (!userLog) {
          // Si es un usuario nuevo (no hay userLog)
          setStatus("Permiso otorgado. Continuar a registro.");
          console.log("Permiso otorgado. El token está en localStorage.");
        }

        // 8. Lógica anterior: Navega a /subscribe al tener éxito
        navigate("/subscribe");

      } else {
        // 9. Lógica anterior: Maneja el FALLO (permiso denegado, etc.)
        playSound(infoSound);
        console.error("No se pudo generar el token de notificación.");
        toast.error("No se pudo activar el permiso. Inténtalo de nuevo.");

        // Permiso no otorgado: permanece en la página para reintentar
      }
    } catch (error) {
      // 11. Lógica anterior: Maneja errores inesperados
      playSound(infoSound);
      console.error("Error en handlePermission:", error);
      logToFirestore("FORMPAGE", error, { context: "handlePermission" });
      toast.error("Ocurrió un error inesperado.");
      // No navegues si hay un error, quédate en la página
    } finally {
      // 12. Lógica anterior: Siempre detén la carga al final
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
    playSound(infoSound);
    toast.info("Permiso omitido.");
    setShowModal(false);
    navigate("/subscribe");
  };

  const handleOpenInBrowser = () => {
    try {
      const url = window.location.href;
      window.open(url, '_blank', 'noopener');
      toast.info("Si sigues dentro de la app, usa el menú ⋯ para abrir en navegador.");
    } catch (e) {
      console.warn("No se pudo abrir en navegador:", e);
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado. Ábrelo manualmente en tu navegador.");
    } catch (e) {
      console.warn("No se pudo copiar el enlace:", e);
      toast.error("No se pudo copiar el enlace.");
    }
  };

  // 4. Pantalla de carga (si 'loading' es true)
  if (loading) {
    return (
      <FormLayout>
        <div className="PermissionScreen" style={{ justifyContent: 'center', height: '60vh', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center', marginTop: '1rem' }}>
            Activando servicio de notificaciones... <br />
            Estableciendo conexion con Google
          </h2>
          <button className="btn btn-outline" onClick={handleManualReload}>
            Reiniciar la Página
          </button>
          <p style={{ color: 'white', opacity: 0.8, textAlign: 'center', margin: '0.5rem 0 2rem' }}>
            (Esto puede tardar unos segundos <br />
            de tardarse demasiado recargar la página)
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
          {inAppBrowser && (
            <p className="permissionScreen__text" style={{ marginTop: '0.5rem', color: '#ffd27d' }}>
              Estás dentro de un navegador de una app (Instagram, Facebook, etc.).
              Abre esta página en un navegador nativo (Chrome/Firefox en Android o Safari en iOS). En iOS, añade la app a la pantalla de inicio para activar las notificaciones.
            </p>
          )}
          {iosNeedsPWA && (
            <div style={{ marginTop: '0.75rem', color: '#ffd27d' }}>
              <p className="permissionScreen__text" style={{ marginBottom: '0.5rem' }}>
                Para activar notificaciones en iOS, primero añade esta página a la pantalla de inicio y ábrela desde ahí:
              </p>
              <ul style={{ textAlign: 'left', fontSize: '0.8em', lineHeight: 1.4, paddingLeft: '1rem' }}>
                <li>1. Toca el botón Compartir (icono cuadrado con flecha arriba) en Safari.</li>
                <li>2. Selecciona “Añadir a pantalla de inicio”.</li>
                <li>3. Abre la app desde el icono en tu pantalla de inicio.</li>
                <li>4. Vuelve a esta sección y acepta el permiso.</li>
              </ul>
            </div>
          )}
        </div>
        <button className="btn btn-acento" onClick={handlePermission} disabled={loading || inAppBrowser}>
          {"Permitir"}
        </button>
        {inAppBrowser && (
          <div className="PermissionScreen__modal-buttons" style={{ marginTop: '0.5rem' }}>
            <button className="btn btn-outline" onClick={handleOpenInBrowser}>Abrir en navegador</button>
            <button className="btn btn-outline" onClick={handleCopyLink}>Copiar enlace</button>
          </div>
        )}
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

// Helper: espera a que el permiso en iOS/PWA se estabilice (OneSignal y API nativa)
async function waitForIosPermissionState(timeoutMs = 3000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    try {
      const osPerm = await OneSignal.Notifications.permission;
      const nativePerm = typeof Notification !== 'undefined' ? Notification.permission : undefined;
      if (osPerm === 'granted' || nativePerm === 'granted') return 'granted';
      if (osPerm === 'denied' || nativePerm === 'denied') return 'denied';
    } catch (e) {
      // Ignorar y seguir intentando
    }
    await new Promise(r => setTimeout(r, 250));
  }
  try {
    return await OneSignal.Notifications.permission;
  } catch {
    return typeof Notification !== 'undefined' ? Notification.permission : 'default';
  }
}

export default FormPage;
