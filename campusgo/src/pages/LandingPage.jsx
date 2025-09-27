import React from "react"; 
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import LogoUCA from "../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png";
import Lema from "../assets/images/lema.png";
import Sticker1 from "../assets/stickers/elemento1.png";
import Sticker2 from "../assets/stickers/elemento2.png";
import Sticker7 from "../assets/stickers/elemento7.png";
import Sticker9 from "../assets/stickers/elemento9.png";

function LandingPage() {
  const navigate = useNavigate();

  const stickers = [
    Sticker1, Sticker2, Sticker7, Sticker9
  ];

  return (
    <div className="landing-container">
      {/* Stickers de fondo */}
      {stickers.map((sticker, index) => (
        <img
          key={index}
          src={sticker}
          alt={`Sticker ${index + 1}`}
          className={`sticker sticker-${index + 1}`}
        />
      ))}

      {/* Logo de la universidad */}
      <header className="landing-header">
        <img src={LogoUCA} alt="Logo Universidad" className="landing-logo" />
      </header>

      {/* Contenido principal */}
      <main className="landing-main">
        <img src={Lema} alt="Lema" className="landing-lema" />
        <h1 className="landing-title">¡Bienvenidos nuestro primer evento de diseño!</h1>
        <button className="landing-btn" onClick={() => navigate("/form")}>
          Comencemos
        </button>
      </main>
    </div>
  );
}

export default LandingPage;
