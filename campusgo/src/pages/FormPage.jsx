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
  const [status, setStatus] = useState("Esperando permiso..."); 

  const handlePermission = async () => {
    const result = await generateToken(); 
    console.log("Resultado de generateToken:", result); 

    // --- INICIO DE LA SOLUCIÓN ---
    // 1. Comprueba si se necesita recargar
    if (result.reload) {
      toast.info("Activando servicio de notificaciones... recargando.");
      // Recarga la página para que el SW tome el control
      // Damos 2 seg para que el usuario vea el toast
      setTimeout(() => window.location.reload(), 2000); 
      return; // Detiene la ejecución aquí
    }
    // --- FIN DE LA SOLUCIÓN ---

    // 2. Comprueba si tuvo éxito (si no se recargó)
    if (result.success) { 
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
        console.log("Permiso otorgado. El token está en localStorage, se usará en el registro.");
      }
      navigate("/subscribe"); // Navega
    } else {
      console.error("No se pudo generar el token de notificación.");
      navigate("/form"); // Navega de todos modos
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
    navigate("/landing");
  };

  return (
    <FormLayout>
      <div className="PermissionScreen">
        <img src={Sticker1} alt="Icono permisos" className="PermissionScreen__icon" />
        <h2 className="PermissionScreen__title">Activar las notificaciones</h2>
        <div className="PermissionScreen__text-container">
          {/* ... (texto) ... */}
        </div>
        <button className="btn btn-acento" onClick={handlePermission}>
          Permitir
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
          {/* ... (texto) ... */}
          <div className="PermissionScreen__modal-buttons">
            <button className="btn btn-acento" onClick={handlePermission}>Aceptar</button>
            <button className="btn btn-outline" onClick={handleConfirmSkip}>No aceptar</button>
          </div>
        </Modal>
      )}
      <Footer />
    </FormLayout>
  );
}

export default FormPage;