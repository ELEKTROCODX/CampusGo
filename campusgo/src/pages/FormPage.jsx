import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPage.css";
import Sticker1 from "../assets/stickers/elemento1.png";
import LogoUCA from "../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png";
import {messaging} from "../firebase/firebase"
import { getToken } from "firebase/messaging";
import { generateToken } from "../firebase/firebase";

function FormPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const handlePermission = async () => { 
    const success = await generateToken();
    console.log("Success: ",success);
    if(success){
      navigate("/register");
    }
  };

  const handleSkip = () => {
    setStep(2);
  };

  return (
    <div className="form-container">
      <header className="form-header">
        <img src={LogoUCA} alt="Logo Universidad" className="form-logo" />
      </header>
      <img src={Sticker1} alt="Icono permisos" className="permission-icon" />
      <h2 className="landing-text">Activar las notificaciones</h2>
      <div className="text-container">
        <p className="landing-text">
          Queremos guiarte en cada momento del evento, por lo que necesitamos tu permiso para enviarte notificaciones en tiempo real.
        </p>
      </div>
      <button className="permission-start-btn" onClick={handlePermission}>
        Permitir
      </button>

      <div className="progress-bottom">
        <span className="no-permit-text" onClick={handleSkip}>
          Saltar paso
        </span>
      </div>

      {step === 1 && (
        <div className="permission-box">

        </div>
      )}

      {step === 2 && (
        <div className="overlay-step2" onClick={() => setStep(1)}>
          <div
            className="overlay-box-step2"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>¿Estás seguro de que quieres saltarte las notificaciones?</h3>
            <p>Si no aceptas, no podrás disfrutar de la experiencia completa.</p>
            <div className="permission-buttons">
              <button onClick={generateToken}>Aceptar</button>
              <button onClick={() => navigate("/register")}>No aceptar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default FormPage;