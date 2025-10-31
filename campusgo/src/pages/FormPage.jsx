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

  const handlePermission = async () => {
    setLoading(true);

    try {
      const result = await generateToken();

      if (result.reload) {
        playSound(infoSound);
        toast.info("Activando servicio de notificaciones...");
        setTimeout(() => window.location.reload(), 2000);
        return;
      }

      if (result.success) {
        playSound(infoSound);
        toast.success("¡Permiso aceptado! Token guardado.");
        if (userLog) {
          try {
            const userRef = doc(db, "Usuarios", userLog);
            await updateDoc(userRef, { fcmToken: result.token });
            console.log("Token actualizado en Firestore para usuario existente.");
          } catch (error) {
            console.warn("Error (no crítico) al actualizar el token en Firestore:", error);
          }
        } else {
          setStatus("Permiso otorgado. Continuar a registro.");
          console.log("Permiso otorgado. El token está en localStorage.");
        }
        navigate("/subscribe");
      } else {
        playSound(infoSound);
        console.error("No se pudo generar el token de notificación.");
        toast.error("No se pudo activar el permiso. Inténtalo de nuevo.");
        navigate("/form");
      }
    } catch (error) {
      playSound(infoSound);
      console.error("Error en handlePermission:", error);
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
    playSound(infoSound);
    toast.info("Permiso omitido.");
    setShowModal(false);
    navigate("/landing");
  };

  // ... (El resto de tu JSX de return no cambia) ...
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
          {loading ? "Comprobando..." : "Permitir"}
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
            <button className="btn btn-acento" onClick={handlePermission} disabled={loading}>Aceptar</button>
            <button className="btn btn-outline" onClick={handleConfirmSkip}>No aceptar</button>
          </div>
        </Modal>
      )}
      <Footer />
    </FormLayout>
  );
}

export default FormPage;