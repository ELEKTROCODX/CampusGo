import React, { useEffect } from "react";
// 1. Importa Navigate para la redirección
import { Routes, Route, Navigate } from "react-router-dom";
import { postEventDate } from "./config.js";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// ... (Importaciones de tus páginas)
import CountdownPage from "./pages/CountdownPage.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import RegistrationPage from "./pages/FormPage.jsx";
import FormPageTwo from "./pages/FormPageTwo.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import MapPage from "./pages/MapPage.jsx";
import PostEventPage from "./pages/PostEventPage.jsx";
import SubscribePage from "./pages/SubscribePage.jsx";

// ... (Importaciones de Firebase)
import { messaging } from "./firebase/firebase.js";
import { onMessage } from "firebase/messaging";

function App() {

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log(payload);
    });
  }, []);

  const now = new Date();
  const isAfterEvent = now >= postEventDate;

  return (
    <>
      <Routes>
        <Route path="/" element={<CountdownPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/form" element={<RegistrationPage />} />
        <Route path="/register" element={<FormPageTwo />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/subscribe" element={<SubscribePage />} />

        <Route
          path="/pevent"
          element={isAfterEvent ? <PostEventPage /> : <Navigate to="/" replace />}
        />

        {/* 3. Redirige a la raíz ("/") usando Navigate */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>


      <ToastContainer
        position="bottom-center" 
        autoClose={3000} 
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