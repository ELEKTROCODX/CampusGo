import React, { useState } from "react";
import "./FormPage.css"; 
import { useNavigate } from "react-router-dom";
import { auth, db } from '../firebase/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import FormLayout from "../layouts/FormLayout/FormLayout";
import FormInput from "../components/FormInput/FormInput";

import Sticker2 from "../assets/stickers/elemento2.png";
import Sticker7 from "../assets/stickers/elemento7.png";
import Sticker9 from "../assets/stickers/elemento9.png";

function FormPageTwo() {
  const navigate = useNavigate();
  const [step, setStep] = useState(3);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { email, name, company } = formData;

    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      const fcmToken = localStorage.getItem('fcmToken');
      const userData = { name, email, company };

      if (fcmToken) {
        userData.fcmTokens = [fcmToken];
        localStorage.removeItem('fcmToken');
      }

      await setDoc(doc(db, "Usuarios", user.uid), userData);
      console.log("Usuario registrado y datos guardados: ", user.uid);
      setLoading(false);
      setStep(4); 
    } catch (error) {
      console.error("Error al registrar:", error.message);
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <FormLayout>
      {step === 3 && (
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
        </div>
      )}
    </FormLayout>
  );
}

export default FormPageTwo;