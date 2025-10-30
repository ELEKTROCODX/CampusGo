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

function FormPage() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const userLog = localStorage.getItem('userLog');

  // 1. Estado para manejar la carga/espera
  const [loading, setLoading] = useState(false);
  // Estado para saber si la carga ya superó el tiempo mínimo
  const [showReloadOption, setShowReloadOption] = useState(false);

  // Función para forzar la recarga de la página
  const handleManualReload = () => {
    toast.info("Reiniciando la página para completar la activación...");
    window.location.reload();
  };

  const handlePermission = async () => {
    if (loading) return;

    setShowModal(false);
    setLoading(true); // Iniciar estado de carga

    try {
      const result = await generateToken();
      setShowReloadOption(false); // Ocultar opción de reinicio

      if (result.success) {
        toast.success("¡Permiso aceptado! Token guardado.");

        if (userLog && result.token) {
          try {
            const userRef = doc(db, "Usuarios", userLog);
            await updateDoc(userRef, { fcmToken: result.token });
            console.log("Token actualizado en Firestore.");
          } catch (error) {
            console.warn("Error (no crítico) al actualizar el token en Firestore:", error);
          }
        }

        navigate("/subscribe");
      } else {
        toast.info("Notificaciones no permitidas. Puedes activarlas más tarde.");
        navigate("/subscribe");
      }
    } catch (error) {
      setShowReloadOption(false);
      console.error("Error en handlePermission:", error);
      toast.error("Ocurrió un error inesperado al solicitar permisos.");
      navigate("/subscribe");
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
    toast.info("Permiso omitido.");
    setShowModal(false);
    navigate("/subscribe");
  };

  // 4. Pantalla de carga (si 'loading' es true)
  if (loading) {
    return (
      <FormLayout>
        <div className="PermissionScreen" style={{ justifyContent: 'center', height: '60vh', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
          {/* Eliminamos la imagen rotando y ponemos un mensaje */}
          <h2 style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center', marginTop: '1rem' }}>
            Activando servicio de notificaciones...
            Estableciendo conexion con Google
          </h2>
          <button className="btn btn-outline" onClick={handleManualReload}>
              Reiniciar la Página
            </button>
          <p style={{ color: 'white', opacity: 0.8, textAlign: 'center', margin: '0.5rem 0 2rem' }}>
            (Esto puede tardar unos segundos)
          </p>

          {/* BOTÓN DE REINICIO MANUAL (Solo visible después del timeout) */}
          {showReloadOption && (
            <button className="btn btn-outline" onClick={handleManualReload}>
              Reiniciar la Página
            </button>
          )}
        </div>
      </FormLayout>
    );
  }

  // 5. Página de formulario normal
  return (
    <FormLayout>
      <div className="PermissionScreen">
        <img src={Sticker1} alt="Icono permisos" className="PermissionScreen__icon" />
        <h2 className="PermissionScreen__title">Activar las notificaciones</h2>
        <div className="PermissionScreen__text-container">
          <p>
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
          <h3>¿Estás seguro de que quieres saltarte las notificaciones?</h3>
          <p>Si no aceptas, no podrás disfrutar de la experiencia completa.</p>
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
