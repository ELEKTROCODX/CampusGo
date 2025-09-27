import React, { useState } from "react";
import "./FormPage.css";
import Sticker1 from "../assets/stickers/elemento1.png";
import Sticker2 from "../assets/stickers/elemento2.png";
import Sticker7 from "../assets/stickers/elemento7.png";
import Sticker9 from "../assets/stickers/elemento9.png";
import LogoUCA from "../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png";

function FormPage() {
  const [step, setStep] = useState(1);
  const [notificationsAllowed, setNotificationsAllowed] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });

  const handlePermission = (allow) => {
    setNotificationsAllowed(allow);
    if (allow) Notification.requestPermission();
    setStep(3);
  };

  const handleSkip = () => setStep(2);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(4);
  };

  const goToStep = (targetStep) => {
    if (targetStep < step) setStep(targetStep);
  };

  return (
    <div className="form-container">
      <header className="form-header">
        <img src={LogoUCA} alt="Logo Universidad" className="form-logo" />
      </header>

      {/* Step 1 */}
      {step === 1 && notificationsAllowed === null && (
        <div className="permission-box">
          <img src={Sticker1} alt="Icono permisos" className="permission-icon" />
          <h2 className="landing-text">Activar las notificaciones</h2>
          <p className="landing-text">
            Queremos guiarte en cada momento del evento, por lo que necesitamos tu permiso para enviarte notificaciones en tiempo real.
          </p>
          <button className="permission-start-btn" onClick={() => setStep(2)}>
            Permitir
          </button>
          <div className="permission-box-box">
            <span className="no-permit-text" onClick={handleSkip}>
              Saltar paso
            </span>
          </div>
        </div>
      )}

      {/* Step 2: Popup sobre Step1 */}
      {step === 2 && (
        <div className="overlay-step2">
          <div className="overlay-box-step2">
            <h3>¿Estás seguro de que quieres saltarte las notificaciones?</h3>
            <p>Si no aceptas, no podrás disfrutar de la experiencia completa.</p>
            <div className="permission-buttons">
              <button onClick={() => handlePermission(true)}>Aceptar</button>
              <button onClick={() => setStep(3)}>Continuar sin aceptar</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Login */}
      {step === 3 && (
        <div className="login-container">
          <form className="form-box" onSubmit={handleSubmit}>
            <h2>Registro</h2>
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="company"
              placeholder="Empresa"
              value={formData.company}
              onChange={handleChange}
              required
            />
            <button type="submit">Comenzar</button>
          </form>
        </div>
      )}

      {/* Step 4: Bienvenida */}
      {step === 4 && (
        <div className="welcome-step">
          <img src={Sticker2} alt="" className="background-sticker" />
          <img src={Sticker7} alt="" className="background-sticker" />
          <img src={Sticker9} alt="" className="background-sticker" />
          <div className="welcome-content">
            <h2>Bienvenido {formData.name}</h2>
            <p>
              Nos alegra que seas parte del primer evento de diseño de la UCA, tenemos preparado dinámicas para que conozcas un poco sobre cómo el diseño se toma la UCA.
            </p>
            <p>
              Dentro de nuestra landing encontrarás toda la información necesaria sobre este evento y mantén tu móvil listo porque en cada dinámica deberás escanear un código QR para marcarla como visitada.
            </p>
            <p>¡Disfruta del evento y sé parte de la revolución del diseño en la UCA!</p>
            <button className="permission-start-btn">Entrar al evento</button>
          </div>
        </div>
      )}

      {/* Líneas de progreso */}
      {step >= 1 && (
        <div className="progress-bottom">
          <div className={`line ${step === 1 ? "active" : ""}`} onClick={() => goToStep(1)}></div>
          <div className={`line ${step === 2 ? "active" : ""}`} onClick={() => goToStep(2)}></div>
          <div className={`line ${step === 3 ? "active" : ""}`} onClick={() => goToStep(3)}></div>
        </div>
      )}
    </div>
  );
}

export default FormPage;
