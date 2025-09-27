import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CountdownPage from "./pages/CountdownPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import RegistrationPage from "./pages/FormPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CountdownPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/form" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
