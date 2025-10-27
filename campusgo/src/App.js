import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import CountdownPage from "./pages/CountdownPage.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import RegistrationPage from "./pages/FormPage.jsx";
import FormPageTwo from "./pages/FormPageTwo.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import MapPage from "./pages/MapPage.jsx";
import { messaging } from "./firebase/firebase.js";
import { onMessage } from "firebase/messaging";
import PostEventPage from "./pages/PostEventPage.jsx";
import SubscribePage from "./pages/SubscribePage.jsx";

function App() {

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log(payload);
    });
  });

  return (
    <Routes>
      <Route path="/" element={<CountdownPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/form" element={<RegistrationPage />} />
      <Route path="/register" element={<FormPageTwo />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/pevent" element={<PostEventPage />} />
      <Route path="/subscribe" element={<SubscribePage />} />
    </Routes>
  );
}

export default App;