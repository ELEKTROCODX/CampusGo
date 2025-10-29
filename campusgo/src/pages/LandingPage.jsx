import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import QRScanner from "../components/QRScanner";
import "./LandingPage.css";
import '../components/QRScanner.css';

// 1. Importa 'toast'
import { toast } from 'react-toastify';

import ActivityCard from "../components/ActivityCard/ActivityCard";
import SpeakerCard from "../components/SpeakerCard/SpeakerCard";
import Footer from "../components/Footer/Footer";

// (El resto de tus importaciones de assets...)
import Lema from "../assets/images/lema.png";
import Logo from "../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png";
import Sticker1 from "../assets/stickers/elemento8.png";
import Sticker2 from "../assets/stickers/elemento6.png";
import Sticker3 from "../assets/stickers/elemento7.png";
import Sticker4 from "../assets/stickers/elemento4.png";
import Sticker5 from "../assets/stickers/elemento5.png";
import Mapa from "../assets/stickers/elemento2.png";

import SpeakerImg1 from "../assets/ponents/ponente1.jpeg"; 
import SpeakerImg2 from "../assets/ponents/ponente2.jpeg";
import SpeakerImg3 from "../assets/ponents/ponente3.jpeg";

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
    let stationFound = false;

    const updated = stations.map((s) => {
      if (s._uuid === code) {
        stationFound = true; 
        toast.success(`¡Estación visitada: ${s.name}!`); 
        return { ...s, status: "Visitado" }; 
      } else {
        return s; 
      }
    });

    if (!stationFound) {
      toast.error("Código QR no reconocido.");
    }

    setStations(updated); 
    setShowScanner(false); 
  }

  return (
    <div className="landing-page-container">
      <img src={Sticker1} alt="Sticker de fondo 1" className="sticker fixed sticker-1" />
      <img src={Sticker2} alt="Sticker de fondo 2" className="sticker fixed sticker-2" />
      <img src={Sticker3} alt="Sticker de fondo 3" className="sticker fixed sticker-3" />
      <img src={Sticker4} alt="Sticker de fondo 4" className="sticker fixed sticker-4" />
      <img src={Sticker5} alt="Sticker de fondo 5" className="sticker fixed sticker-5" />

      <section className="page-section welcome-section">
        <Link to="/">
          <img src={Logo} alt="UCA Logo" className="logo" />
        </Link>
        <img src={Lema} alt="Lema El Diseño se toma la UCA" className="welcome-section__lema" />
        <div className="welcome-section__tags">
          <a href="https://uca.edu.sv/carrera/arquitectura-presencial/" target="_blank" rel="noopener noreferrer">
             <span className="tag tag--arq">ARQ</span>
          </a>
          <a href="https://uca.edu.sv/postgrados/ingenieria-y-diseno/diseno-de-productos-y-servicios/" target="_blank" rel="noopener noreferrer">
             <span className="tag tag--medp">MDPS</span>
          </a>
          <a href="https://uca.edu.sv/carrera/licenciatura-en-diseno-semipresencial/" target="_blank" rel="noopener noreferrer">
             <span className="tag tag--led">LeD</span>
          </a>
        </div>
        <div className="welcome-section__greeting">
          <div className="welcome-section__user-name"></div> {/*Nombre del usuario */}
          <div className="welcome-section__subtitle">¡Eres parte de nuestro primer evento de diseño!</div>
        </div>
      </section>

      {showScanner && (
        <QRScanner
          onDetected={handleDetected}
          onClose={() => setShowScanner(false)}
        />
      )}

      <section className="page-section qr-section">
        <h3 className="qr-section__title">Escanea tus códigos QR</h3>
        <p className="qr-section__subtitle">para registrar tu visita en cada actividad</p>
        <button className="btn btn-acento" onClick={() => setShowScanner(true)}>
          Escanear QR
        </button>
      </section>

      <section className="page-section activities-section">
        {stations.map((s, i) => (
          <ActivityCard key={s._uuid} station={s} index={i} />
        ))}
      </section>

      <section className="page-section speakers-section">
        <h2 className="speakers-section__title">Conoce a nuestros ponentes</h2>
        <div className="speakers-section__grid">
          <SpeakerCard
            name={<>José<br />Moz</>} // Permite salto de línea
            role="Gerente de Diseño de Experiencias"
            imgSrc={SpeakerImg1} // Usa la variable renombrada
            style={{ gridColumn: '1 / 2' }} 
          />
          <SpeakerCard 
            name="Rossemberg Rivas" 
            role="Artista, Diseñador, Premio Cultura" 
            imgSrc={SpeakerImg2}
            style={{ gridColumn: '2 / 3', marginTop: '150px' }}
          />
          <SpeakerCard 
            name="Carmen Valenzuela" 
            role="Directora LeD"
            imgSrc={SpeakerImg3}
            style={{ gridColumn: '1 / 2', marginTop: '-150px' }} 
          />
        </div>
      </section>

      <section className="page-section info-section">
        <div className="map-section">
          <h2 className="map-section__title">¿Cómo llegar a las exposiciones?</h2>
          <img src={Mapa} alt="Mapa del evento" className="map-section__image" />
          <button className="btn btn-secondary" onClick={() => navigate("/map")}>Ver mapa</button>
        </div>
      </section>      
      <Footer/>
    </div>
  );
}

export default LandingPage;