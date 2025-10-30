import React from "react";
import { useNavigate } from "react-router-dom"; // Se eliminó useState y useEffect
import "./WelcomePage.css";
import Lema from "../assets/images/lema.png";
import Sticker1 from "../assets/stickers/elemento1.png";
import Sticker2 from "../assets/stickers/elemento2.png";
import Sticker7 from "../assets/stickers/elemento7.png";
import Sticker9 from "../assets/stickers/elemento9.png";
import Footer from "../components/Footer/Footer";
// Se eliminaron las importaciones de 'config'
import FormLayout from "../layouts/FormLayout/FormLayout";

function WelcomePage() { // Asegúrate que el nombre sea 'WelcomePage'
  const navigate = useNavigate();

  // Se eliminó el estado 'pageMode'
  // Se eliminó el 'useEffect'

  const stickers = [
    { src: Sticker1, id: 1 },
    { src: Sticker2, id: 2 },
    { src: Sticker7, id: 3 },
    { src: Sticker9, id: 4 }
  ];

  // Se eliminaron 'handleNavigate' y 'getButtonText'

  return (
    <FormLayout>
      {/* Los stickers ahora son siempre visibles */}
      {stickers.map((sticker) => (
        <img
          key={sticker.id}
          src={sticker.src}
          alt={`Sticker ${sticker.id}`}
          className={`WelcomePage__sticker WelcomePage__sticker--${sticker.id}`}
        />
      ))}

      <img src={Lema} alt="Lema" className="WelcomePage__lema" />

      {/* Contenido estático (tomado de tu ejemplo) */}
      <div className="p-container">
        <p className="WelcomePage__event-details">
          Bienvenido a nuestro primer networking de diseño
        </p>
      </div>
      
      {/* Se eliminó el bloque 'during' */}

      {/* El botón ahora siempre hace lo mismo */}
      <button className="btn btn-acento" onClick={() => navigate("/form")}>
        Comencemos
      </button>
      
      <Footer />
    </FormLayout>
  );
}

export default WelcomePage; 