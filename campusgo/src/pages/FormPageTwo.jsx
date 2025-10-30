import React, { useState } from "react";
import "./FormPage.css";
import { useNavigate } from "react-router-dom";
import FormLayout from "../layouts/FormLayout/FormLayout";
import Sticker2 from "../assets/stickers/elemento2.png";
import Sticker7 from "../assets/stickers/elemento7.png";
import Sticker9 from "../assets/stickers/elemento9.png";
import Footer from "../components/Footer/Footer";

function FormPageTwo() {
  const navigate = useNavigate();
  const [step] = useState(3);

  const [formData] = useState({
    name: "",
    email: "",
    company: "",
  });

  return (
    <FormLayout>

      {step === 3 && (
        <>
          <div className="WelcomeScreen">
            <img src={Sticker2} alt="" className="WelcomeScreen__sticker sticker-1" />
            <img src={Sticker7} alt="" className="WelcomeScreen__sticker sticker-2" />
            <img src={Sticker9} alt="" className="WelcomeScreen__sticker sticker-3" />

            <div className="card card--welcome">
              <h2>Bienvenido {formData.name}</h2>
              <p>
                Nos alegra que seas parte de nuestro primer evento de diseño,
                tenemos preparado dinámicas para que conozcas un poco sobre cómo
                <span><b> el diseño se toma la UCA.</b></span>
              </p>
              <p>
                Dentro de nuestra landing encontrarás toda la información
                necesaria sobre este evento y mantén tu móvil listo porque en cada
                dinámica deberás escanear un código QR para marcarla como
                visitada.
              </p>
              <p>
                ¡Disfruta del evento y sé parte de la revolución del diseño en la
                UCA!
              </p>
              <button className="btn btn-acento" onClick={() => navigate("/landing")}>
                Comencemos
              </button>
            </div>
            <Footer></Footer>

          </div>
        </>
      )}
    </FormLayout>
  );
}

export default FormPageTwo;