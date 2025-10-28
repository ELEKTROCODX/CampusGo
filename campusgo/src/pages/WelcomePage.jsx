import React from "react";
import { useNavigate, Link } from "react-router-dom"; // 1. Usar Link
import "./WelcomePage.css"; // CSS limpio
import Lema from "../assets/images/lema.png";
import Sticker1 from "../assets/stickers/elemento1.png";
import Sticker2 from "../assets/stickers/elemento2.png";
import Sticker7 from "../assets/stickers/elemento7.png";
import Sticker9 from "../assets/stickers/elemento9.png";

// 2. Importar el Layout que ya tiene el fondo y el logo
import FormLayout from "../layouts/FormLayout/FormLayout";
import Footer from "../components/Footer/Footer"; // <-- 1. IMPORTADO


function WelcomePage() {
  const navigate = useNavigate();

  const stickers = [
    { src: Sticker1, id: 1 },
    { src: Sticker2, id: 2 },
    { src: Sticker7, id: 3 },
    { src: Sticker9, id: 4 }
  ];

  return (
    <FormLayout>
      {stickers.map((sticker) => (
        <img
          key={sticker.id}
          src={sticker.src}
          alt={`Sticker ${sticker.id}`}
          className={`WelcomePage__sticker WelcomePage__sticker--${sticker.id}`}
        />
      ))}
      <img src={Lema} alt="Lema" className="WelcomePage__lema" />
      <h1 className="WelcomePage__title">¡Bienvenidos nuestro primer evento de diseño!</h1>

      <button className="btn btn-acento" onClick={() => navigate("/form")}>
        Comencemos
      </button>
      <Footer></Footer>
    </FormLayout>
  );
}

export default WelcomePage;