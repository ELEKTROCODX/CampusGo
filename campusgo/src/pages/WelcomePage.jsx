import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";
import Lema from "../assets/images/lema.png";
import Sticker1 from "../assets/stickers/elemento1.png";
import Sticker2 from "../assets/stickers/elemento2.png";
import Sticker7 from "../assets/stickers/elemento7.png";
import Sticker9 from "../assets/stickers/elemento9.png";
import Footer from "../components/Footer/Footer"
import { eventStartDate, postEventDate } from "../config";
import FormLayout from "../layouts/FormLayout/FormLayout";


function WelcomePage() {
  const navigate = useNavigate();
  const [pageMode, setPageMode] = useState('before');

  useEffect(() => {
    const now = new Date();

    if (now >= postEventDate) {
      setPageMode('after');
    } else if (now >= eventStartDate) {
      setPageMode('during');
    }
  }, []);

  const stickers = [
    { src: Sticker1, id: 1 },
    { src: Sticker2, id: 2 },
    { src: Sticker7, id: 3 },
    { src: Sticker9, id: 4 }
  ];

  const handleNavigate = () => {
    if (pageMode === 'after') {
      navigate("/pevent"); // Ir a "Revive el Evento"
    } else {
      navigate("/form"); // Ir al formulario de registro
    }
  };

  const getButtonText = () => {
    if (pageMode === 'after') {
      return "Revive el Evento";
    }
    return "Comencemos";
  };

  return (
    <FormLayout>
      {pageMode !== 'after' && stickers.map((sticker) => (
        <img
          key={sticker.id}
          src={sticker.src}
          alt={`Sticker ${sticker.id}`}
          className={`WelcomePage__sticker WelcomePage__sticker--${sticker.id}`}
        />
      ))}

      <img src={Lema} alt="Lema" className="WelcomePage__lema" />

      {pageMode === 'before' && (
        <>
          <h1 className="WelcomePage__title">¡Bienvenidos!</h1>
          <p></p>

          <div className="p-container">
            <p className="WelcomePage__event-details">
              Nos alegra que seas parte del primer networking de diseño de la UCA.
            </p>

            <p className="WelcomePage__event-details">
              Dentro de nuestra landing encontrarás toda la información necesaria sobre este evento y mantén tu móvil listo porque en cada dinámica deberas escanear un código QR para marcarla como visitada.
            </p>

            <p className="WelcomePage__event-details">
              ¡Disfruta del evento y se parte de la revolución del diseño en la UCA!
            </p>
          </div>
        </>
      )}


      {pageMode === 'during' && (
        <>
          <h1 className="WelcomePage__title">¡ES HOY!</h1>
          <div className="WelcomePage__event-details">
            <p>UCA Edificio ICAS<br />5:30 PM</p>
          </div>
        </>
      )}


      <button className="btn btn-acento" onClick={handleNavigate}>
        {getButtonText()}
      </button>
      <Footer></Footer>
    </FormLayout>
  );
}

export default WelcomePage;