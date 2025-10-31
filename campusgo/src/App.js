import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postEventDate } from "./config.js"; 
import CountdownPage from "./pages/CountdownPage.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import RegistrationPage from "./pages/FormPage.jsx";
import FormPageTwo from "./pages/FormPageTwo.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import MapPage from "./pages/MapPage.jsx";
import PostEventPage from "./pages/PostEventPage.jsx";
import SubscribePage from "./pages/SubscribePage.jsx";
import { messaging } from "./firebase/firebase.js";
import { onMessage } from "firebase/messaging";

function App() {

  useEffect(() => {
    const soundPath = "/duca/sounds/noti.mp3";

    // 1. onMessage devuelve una función 'unsubscribe' para limpiar
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Mensaje recibido en primer plano: ", payload);

      // 2. Crea la instancia de Audio AQUÍ, dentro del evento
      const audio = new Audio(soundPath);
      
      // 3. Intenta reproducir el sonido
      audio.play().catch(e => console.warn("El audio no se pudo reproducir automáticamente:", e));

      toast.info(
        <div>
          <strong>{payload.notification.title}</strong>
          <p>{payload.notification.body}</p>
        </div>
      ); 
    });
    
    // 4. Limpia el 'listener' cuando el componente se desmonte
    return () => unsubscribe();

  }, []);

  const now = new Date();
  const isAfterEvent = now >= postEventDate; 

  return (
    <>
      <Routes>
        {/* ... (Tus rutas están perfectas) ... */}
        <Route path="/" element={<CountdownPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/form" element={<RegistrationPage />} />
        <Route path="/register" element={<FormPageTwo />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route 
          path="/pevent" 
          element={ isAfterEvent ? <PostEventPage /> : <Navigate to="/" replace /> }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="bottom-center" 
        autoClose={10000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" 
      />
    </>
  );
}

export default App;