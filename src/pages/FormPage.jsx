import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPage.css";
import Sticker1 from "../assets/stickers/elemento1.png";
import { generateToken, db, messaging, requestNotificationPermission } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import FormLayout from "../layouts/FormLayout/FormLayout";
import Modal from "../components/Modal/Modal";
import Footer from "../components/Footer/Footer";
import { toast } from "react-toastify";
import { isIosSafari, logToFirestore } from "../utils/functions";
import { handleSubscriptionSuccess } from "../utils/functions";
import { getMessaging, isSupported } from "firebase/messaging"
import firebase from "firebase/compat/app";
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
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const userLog = localStorage.getItem('userLog');
  const [status, setStatus] = useState("Esperando permiso...");
  const [loading, setLoading] = useState(false);
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
        toast.info("Usando OneSignal para las notificaiones...");

        await OneSignal.init({
          appId: process.env.REACT_APP_ONESIGNAL_APPID,
          safari_web_id: process.env.REACT_APP_ONESIGNAL_SAFARI_WEB_ID,
          notifyButton: { enable: true },
          allowLocalhostAsSecureOrigin: true,
        });

        await OneSignal.Notifications.requestPermission(true);
        const permission = await OneSignal.Notifications.permission;
        
        if (permission === "granted") {
          playSound(infoSound);
          toast.success("Permiso concedido");

          const playerId = await OneSignal.User.getId();

          if (userLog && playerId) {
            try {
              const userRef = doc(db, "Usuarios", userLog);
              await updateDoc(userRef, { oneSignalId: playerId });
              console.log("OneSignal ID guardado en Firestore.");
            } catch (error) {
              console.warn("Error al guardar OneSignal ID en Firestore:", error);
            }
          } else if (!userLog) {
            setStatus("Permiso otorgado. Continuar a registro");
            navigate("/subscribe");
          } else {
            playSound(infoSound);
            toast.error("Permiso de notificación denegado en Safari.");
            navigate("/form");
          }


        }
        
        return;
      }

      const result = await generateToken();
      if (result.reload) {
        playSound(infoSound);
        toast.info("Activando servicio de notificaciones...");
        setTimeout(() => window.location.reload(), 2000);
        setLoading(false); // Asegúrate de detener la carga aquí
        return;
      }

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

        // 10. Lógica anterior: Se queda en /form si falla
        navigate("/form");
      }
    } catch (error) {
      // 11. Lógica anterior: Maneja errores inesperados
      playSound(infoSound);
      console.error("Error en handlePermission:", error);
      logToFirestore("FORMPAGE", error);
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
