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
  const [status,setStatus] = useState("Esperando permiso...");

  // 1. ESTE ESTADO ES LA CLAVE
  const [loading, setLoading] = useState(false);

  const handlePermission = async () => {
    // 2. PONER EL ESTADO DE CARGA AL INICIO
    setLoading(true);

    try {
      const result = await generateToken();

      if (result.reload) {
        toast.info("Activando servicio de notificaciones... recargando.");
        setTimeout(() => window.location.reload(), 2000);
        return;
      }

      if (result.success) {
        toast.success("¡Permiso aceptado! Token guardado."); // Toast de éxito
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
        // 3. ELIMINAMOS LA LÓGICA DE NAVEGACIÓN (como pediste antes)
        navigate("/subscribe");
      } else {
        // El toast de error ya se maneja en firebase.js (si usas el Plan B)
        console.error("No se pudo generar el token de notificación.");
        navigate("/form");
      }
    } catch (error) {
      console.error("Error en handlePermission:", error);
      toast.error("Ocurrió un error inesperado.");
    } finally {
      // 4. QUITAR EL ESTADO DE CARGA AL FINAL (INCLUSO SI HAY ERROR)
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
    setShowModal(false); // Cierra el modal
    // navigate("/landing"); // Eliminado
  };

  // 5. ¡AQUÍ ESTÁ TU PANTALLA DE CARGA!
  // Se renderiza ANTES que el return normal si 'loading' es true.
  if (loading) {
    return (
      <FormLayout>
        {/* Usamos FormLayout para mantener el fondo y el logo */}
        <div className="PermissionScreen" style={{ justifyContent: 'center', height: '60vh', alignItems: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center' }}>Validando permisos...</h2>
          {/* Aquí puedes agregar un spinner CSS si quieres */}
        </div>
      </FormLayout>
    );
  }

  // 6. Si loading es false, se muestra la página normal
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
        {/* 7. El botón ahora usa el estado 'loading' (como en tu JSX) */}
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
          <h3>¿Estás seguro de que quieres saltarte las notificaciones?</h3>
          <p>Si no aceptas, no podrás disfrutar de la experiencia completa.</p>
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