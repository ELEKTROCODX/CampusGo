import React, { use, useState } from "react";
import "./FormPage.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from '../firebase/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Sticker2 from "../assets/stickers/elemento2.png";
import Sticker7 from "../assets/stickers/elemento7.png";
import Sticker9 from "../assets/stickers/elemento9.png";
import LogoUCA from "../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(4);
  };

  const handleRegistration = async (e) =>{
    e.preventDefault();
    setLoading(true);
    setError(null);

    const{email,name,company} = formData;

    try{
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      const fcmToken = localStorage.getItem('fcmToken');

      const userData = {
        name: name,
        email: email,
        company: company
      }

      if(fcmToken){
        userData.fcmTokens = [fcmToken];
        localStorage.removeItem('fcmToken');
      }

      await setDoc(doc(db, "Usuarios",user.uid), userData);
      //Borrar console log luego
      console.log("Usuario registrado y datos guardados: ", user.uid);

      setLoading(false);
      navigate('/landing');
    }catch(error){
      console.error("Error al registrar:", error.message);
      setError(error.message);
      setLoading(false);
    }

  }


  return (
    <div className="form-container">
      <header className="form-header">
        <img src={LogoUCA} alt="Logo Universidad" className="form-logo" />
      </header>

      {step === 3 && (
        <div className="login-container">
          <form className="form-box" onSubmit={handleRegistration}>
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
            <button type="submit">Confirmar</button>
          </form>
        </div>
      )}

      {step === 4 && (
        <div className="welcome-step">
          <img src={Sticker2} alt="" className="background-sticker" />
          <img src={Sticker7} alt="" className="background-sticker" />
          <img src={Sticker9} alt="" className="background-sticker" />
          <div className="welcome-content">
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
            <button className="permission-start-btn" onClick={() =>navigate("/landing")}>
              Comencemos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormPageTwo;
