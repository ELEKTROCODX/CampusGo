import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QRScanner from "../components/QRScanner";
import "./LandingPage.css"; 
import './QRScanner.css';

// Importar nuevos componentes
import ActivityCard from "../components/ActivityCard/ActivityCard";
import SpeakerCard from "../components/SpeakerCard/SpeakerCard";
import Footer from "../components/Footer/Footer"; // <-- 1. IMPORTADO

// (El resto de tus importaciones de assets...)
import Lema from "../assets/images/lema.png";
import LogoUCA from "../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png";
import Sticker1 from "../assets/stickers/elemento8.png";
import Sticker2 from "../assets/stickers/elemento6.png";
import Sticker3 from "../assets/stickers/elemento7.png"; // (Asegúrate de tener todas tus importaciones de stickers)
import Sticker4 from "../assets/stickers/elemento4.png";
import Sticker5 from "../assets/stickers/elemento5.png";

import Mapa from "../assets/stickers/elemento2.png";
// 2. ELIMINADAS las importaciones de FacebookIcon, InstagramIcon, etc.
// El componente Footer ya se encarga de ellas.

import Speaker1 from "../assets/ponents/persona.png";
import Speaker2 from "../assets/ponents/persona.png";
import Speaker3 from "../assets/ponents/persona.png";
import Speaker4 from "../assets/ponents/persona.png";


function LandingPage() {
    const navigate = useNavigate();
    const [showScanner, setShowScanner] = useState(false);
    const [stations, setStations] = useState(
      JSON.parse(localStorage.getItem("stations")) || [
        { _uuid: "microcharlas-expertos-ceditec", name: "Microcharlas con expertos", location: "CEDITEC", status: "No visitado" },
        { _uuid: "experiencia-interactiva-nzeb", name: "Experiencia interactiva", location: "NZEB", status: "No visitado" },
        { _uuid: "exhibicion-proyectos-icas", name: "Exhibición de proyectos", location: "Atrio del ICAS", status: "No visitado" },
        { _uuid: "proyeccion-cortos-animados-icas", name: "Proyección de cortos animados", location: "Atrio del ICAS", status: "No visitado" },
      ]
  );
  useEffect(() => {
    localStorage.setItem("stations", JSON.stringify(stations));
  }, [stations]);

  function handleDetected(code) {
    const updated = stations.map((s) =>
      s._uuid === code ? { ...s, status: "Visitado" } : s
    );
    setStations(updated);
    setShowScanner(false);
    alert("¡Estación registrada!");
  }
  return (
    <div className="landing-page-container">
      {/* (Stickers) */}
      <img src={Sticker1} alt="Sticker de fondo 1" className="sticker fixed sticker-1" />
      <img src={Sticker2} alt="Sticker de fondo 2" className="sticker fixed sticker-2" />
      <img src={Sticker3} alt="Sticker de fondo 3" className="sticker fixed sticker-3" />
      <img src={Sticker4} alt="Sticker de fondo 4" className="sticker fixed sticker-4" />
      <img src={Sticker5} alt="Sticker de fondo 5" className="sticker fixed sticker-5" />

      {/* --- SECCIÓN DE BIENVENIDA --- */}
      <section className="page-section welcome-section">
        <img src={LogoUCA} alt="Logo UCA 60 Aniversario" className="logo" />
        <img src={Lema} alt="Lema El Diseño se toma la UCA" className="welcome-section__lema" />
        <div className="welcome-section__tags">
          <span className="tag tag--arq">ARQ</span>
          <span className="tag tag--medp">MeDP</span>
          <span className="tag tag--led">LeD</span>
        </div>
        <div className="welcome-section__greeting">
          <div className="welcome-section__user-name">{ }</div>
          <div className="welcome-section__subtitle">¡Eres parte de nuestro primer evento de diseño!</div>
        </div>
      </section>

      {/* (Scanner) */}
      {showScanner && (
        <QRScanner
          onDetected={handleDetected}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* --- SECCIÓN QR --- */}
      <section className="page-section qr-section">
        <h3 className="qr-section__title">Escanea tu código QR</h3>
        <p className="qr-section__subtitle">para registrar tu asistencia y obtener tu certificado</p>
        <button className="btn btn-acento" onClick={() => setShowScanner(true)}>
          Escanear QR
        </button>
      </section>

      {/* --- SECCIÓN ACTIVIDADES --- */}
      <section className="page-section activities-section">
        {stations.map((s, i) => (
          <ActivityCard key={s._uuid} station={s} index={i} />
        ))}
      </section>

      {/* --- SECCIÓN PONENTES --- */}
      <section className="page-section speakers-section">
        <h2 className="speakers-section__title">Conoce a nuestros ponentes</h2>
        <div className="speakers-section__grid">
          <SpeakerCard name="Nombre Apellido" role="Cargo o profesión" imgSrc={Speaker1} style={{ gridColumn: '1 / 2' }} />
          <SpeakerCard name="Nombre Apellido" role="Cargo o profesión" imgSrc={Speaker2} style={{ gridColumn: '2 / 3', marginTop: '130px' }} />
          <SpeakerCard name="Nombre Apellido" role="Cargo o profesión" imgSrc={Speaker3} style={{ gridColumn: '2 / 3', marginTop: '12px' }} />
          <SpeakerCard name="Nombre Apellido" role="Cargo o profesión" imgSrc={Speaker4} style={{ gridColumn: '1 / 2', marginTop: '-415px' }} />
        </div>
      </section>

      {/* --- SECCIÓN INFO --- */}
      <section className="page-section info-section">
        <div className="map-section">
          <h2 className="map-section__title">¿Cómo llegar a las exposiciones?</h2>
          <img src={Mapa} alt="Mapa del evento" className="map-section__image" />
          <button className="btn btn-secondary" onClick={() => navigate("/map")}>Ver mapa</button>
        </div>

        
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;