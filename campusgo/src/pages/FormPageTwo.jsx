import React, { useState, useEffect } from "react";
import "./FormPage.css"; 
import { useNavigate } from "react-router-dom";
import FormLayout from "../layouts/FormLayout/FormLayout";
import FormInput from "../components/FormInput/FormInput"; // Importar el componente de input
import Sticker2 from "../assets/stickers/elemento2.png";
import Sticker7 from "../assets/stickers/elemento7.png";
import Sticker9 from "../assets/stickers/elemento9.png";

// Importar Firebase (necesario para el registro)
import { auth, db, functions } from '../firebase/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, runTransaction, setDoc } from 'firebase/firestore';
import { httpsCallable } from "firebase/functions";

function FormPageTwo() {
  const navigate = useNavigate();
  // El formulario es el paso 3, la bienvenida es el paso 4
  const [step, setStep] = useState(3); 
  
  // Estados para el formulario (con sus 'setters')
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Funciones de Firebase (movidas aquí desde SubscribePage)
  const topics = ["Grupo_1", "Grupo_2","Grupo_3"];
  const subscribeToTopicCallable = httpsCallable(functions,'subscribeUserToTopicCallable');

  // Función para actualizar el formulario
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Función para registrar al usuario
  const handleRegistration = async (e) =>{
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { email, name, company } = formData;

    try{
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      const fcmToken = localStorage.getItem('fcmToken');
      const registrationDate = new Date().toISOString();
      let assignedTopic = null;

      // Lógica de transacción para asignar tema
      await runTransaction(db, async(transaction) => {
          const counterRef = doc(db,"Metadatos","asignacionTemas");
          const counterDoc = await transaction.get(counterRef);
          let currentIndex = 0;
          if(counterDoc.exists()){
              currentIndex = counterDoc.data().lastAssignedIndex;
          }
          assignedTopic = topics[currentIndex % topics.length];
          const nextIndex = (currentIndex + 1) % topics.length;
          if (counterDoc.exists()) {
              transaction.update(counterRef, { lastAssignedIndex: nextIndex });
          } else {
              transaction.set(counterRef, { lastAssignedIndex: nextIndex });
          }
      });

      const userData = {
          name,
          email,
          company: company || "N/A",
          topic: assignedTopic,
          registeredAt: registrationDate,
      };

      if(fcmToken){
          userData.fcmToken = fcmToken;
          await subscribeToTopicCallable({ 
              token: fcmToken, 
              topic: assignedTopic,
              userId: user.uid 
          });
      }
      
      await setDoc(doc(db,"Usuarios",user.uid), userData);
      localStorage.setItem('userLog',user.uid);
      console.log("Usuario registrado y asignado al tema:", assignedTopic);
      
      // Avanzar al siguiente paso (bienvenida)
      setStep(4);

    } catch(err) {
      console.error("Error al registrar:", err.message);
      setError("Error en el registro: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormLayout>
      {/* --- PASO 3: EL FORMULARIO DE REGISTRO --- */}
      {step === 3 && (
        <div className="RegisterScreen"> {/* Clase contenedora para el form */}
          <form className="card card--form" onSubmit={handleRegistration}>
            <h2>Crear perfil</h2>
            <FormInput
              label="Nombre y apellido*"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Correo electrónico*"
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Empresa"
              name="company"
              placeholder="Empresa"
              value={formData.company}
              onChange={handleChange}
            />
            <button 
              type="submit" 
              className="btn btn-acento" 
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Confirmar'}
            </button>
            {error && <p className="FormInput__error">{error}</p>}
          </form>
        </div>
      )}

      {/* --- PASO 4: EL MENSAJE DE BIENVENIDA --- */}
      {step === 4 && (
        <div className="WelcomeScreen">
          <img src={Sticker2} alt="" className="WelcomeScreen__sticker sticker-1" />
          <img src={Sticker7} alt="" className="WelcomeScreen__sticker sticker-2" />
          <img src={Sticker9} alt="" className="WelcomeScreen__sticker sticker-3" />

          <div className="card card--welcome">
            {/* Ahora formData.name SÍ tendrá un valor */}
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