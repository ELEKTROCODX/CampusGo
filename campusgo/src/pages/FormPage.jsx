import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPage.css"; // CSS limpio
import Sticker1 from "../assets/stickers/elemento1.png";
import { generateToken } from "../firebase/firebase";

import FormLayout from "../layouts/FormLayout/FormLayout";
import Modal from "../components/Modal/Modal";
import Footer from "../components/Footer/Footer"; // <-- 1. IMPORTADO


function FormPage() {
  const [showModal, setShowModal] = useState(false); 
  const navigate = useNavigate();

  const handlePermission = async () => {
    const success = await generateToken();
    console.log("Success: ", success);
    if (success) {
      navigate("/register");
    }
  };

  const handleSkip = () => {
    setShowModal(true); 
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleConfirmSkip = () => {
    navigate("/register"); 
  };

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
          <p>Si no aceptas, no podrás disfrutar de la experiencia completa.</p>
          <div className="PermissionScreen__modal-buttons">
            {/* Usamos botones globales */}
            <button className="btn btn-acento" onClick={handlePermission}>Aceptar</button>
            <button className="btn btn-outline" onClick={handleConfirmSkip}>No aceptar</button>
          </div>
        </Modal>
      )}
    <Footer></Footer>
    </FormLayout>
  );
}

export default FormPage;