import React, { useState, useEffect } from "react"; // 1. Re-introducimos useState y useEffect
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";
import Lema from "../assets/images/lema.png";
import Sticker1 from "../assets/stickers/elemento1.png";
import Sticker2 from "../assets/stickers/elemento2.png";
import Sticker7 from "../assets/stickers/elemento7.png";
import Sticker9 from "../assets/stickers/elemento9.png";
import Footer from "../components/Footer/Footer";
import { eventStartDate, postEventDate } from "../config"; // 2. Re-introducimos las fechas
import FormLayout from "../layouts/FormLayout/FormLayout";

function WelcomePage() {
  const navigate = useNavigate();
  // 3. Re-introducimos el estado del modo de página
  const [pageMode, setPageMode] = useState('before'); 

  // 4. Re-introducimos el useEffect para comprobar la fecha
  useEffect(() => {
    const now = new Date();
    if (now >= postEventDate) {
      setPageMode('after');
    } else if (now >= eventStartDate) {
      setPageMode('during');
    }
    // Si no, se queda en 'before' (por defecto)
  }, []);

  const stickers = [
    { src: Sticker1, id: 1 },
    { src: Sticker2, id: 2 },
    { src: Sticker7, id: 3 },
    { src: Sticker9, id: 4 }
  ];

  // 5. Lógica del botón basada en la fecha
  const handleNavigate = () => {
    if (pageMode === 'after') {
      navigate("/pevent"); // Ir a "Revive el Evento"
      
    } else if (pageMode === 'during') {
      navigate("/landing"); // ¡TU CAMBIO! Ir al Landing durante el evento
      
    } else { // 'before'
      navigate("/form"); // Ir al formulario de permisos antes del evento
    }
  };

  // 6. Lógica para el texto del botón
  const getButtonText = () => {
    if (pageMode === 'after') {
      return "Revive el Evento";
    }
    return "Comencemos"; // El texto es el mismo para 'before' y 'during'
  };

  return (
    <FormLayout>
      {/* Oculta stickers si el evento ya pasó */}
      {pageMode !== 'after' && stickers.map((sticker) => (
        <img
          key={sticker.id}
          src={sticker.src}
          alt={`Sticker ${sticker.id}`}
          className={`WelcomePage__sticker WelcomePage__sticker--${sticker.id}`}
        />
      ))}

      <img src={Lema} alt="Lema" className="WelcomePage__lema" />

      {/* --- MODO "ANTES" (Muestra bienvenida) --- */}
      {pageMode === 'before' && (
        <div className="p-container">
          <p className="WelcomePage__event-details">
            Bienvenido a nuestro primer networking de diseño
          </p>
        </div>
      )}

      {/* --- MODO "DURANTE" (Muestra "¡ES HOY!") --- */}
      {pageMode === 'during' && (
        <>
          <h1 className="WelcomePage__title">¡ES HOY!</h1>
          <div className="WelcomePage__event-details">
            {/* Asegúrate que la hora sea la correcta aquí */}
            <p>UCA Edificio ICAS<br />5:30 PM</p> 
          </div>
        </>
      )}

      <button className="btn btn-acento" onClick={handleNavigate}>
        {getButtonText()}
      </button>
      
      <Footer />
    </FormLayout>
  );
}

export default WelcomePage;