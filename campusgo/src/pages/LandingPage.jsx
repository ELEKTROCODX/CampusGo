import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

import Lema from "../assets/images/lema.png";
import LogoUCA from "../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png";
import Sticker1 from "../assets/stickers/elemento8.png"; 
import Sticker2 from "../assets/stickers/elemento6.png"; 
import Sticker3 from "../assets/stickers/elemento7.png"; 
import Sticker4 from "../assets/stickers/elemento4.png";
import Sticker5 from "../assets/stickers/elemento5.png";

import Mapa from "../assets/stickers/elemento2.png"; 
import LocationIcon from "../assets/icons/location.png"; 
import FacebookIcon from "../assets/icons/facebook.png";
import InstagramIcon from "../assets/icons/instagram.png";
import TikTokIcon from "../assets/icons/tiktok.png";
import XIcon from "../assets/icons/twitter.png"; 
import YoutubeIcon from "../assets/icons/youtube.png";

import Speaker1 from "../assets/ponents/persona.png";
import Speaker2 from "../assets/ponents/persona.png";
import Speaker3 from "../assets/ponents/persona.png";
import Speaker4 from "../assets/ponents/persona.png";


function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className="landing-page-container">
      <img src={Sticker1} alt="Sticker de fondo 1" className="sticker fixed sticker-1" />
      <img src={Sticker2} alt="Sticker de fondo 2" className="sticker fixed sticker-2" />
      <img src={Sticker3} alt="Sticker de fondo 3" className="sticker fixed sticker-3" />
      <img src={Sticker4} alt="Sticker de fondo 4" className="sticker fixed sticker-4" />
      <img src={Sticker5} alt="Sticker de fondo 5" className="sticker fixed sticker-5" />

      <section className="section welcome-section">
        <img src={LogoUCA} alt="Logo UCA 60 Aniversario" className="welcome-logo" />
        <img src={Lema} alt="Lema El Diseño se toma la UCA" className="welcome-lema" />
        <div className="tags-row">
          <span className="tag tag-arq">ARQ</span>
          <span className="tag tag-medp">MeDP</span>
          <span className="tag tag-led">LeD</span>
        </div>
        <div className="user-greeting">
          <div className="user-name">{}</div>
          <div className="user-subtitle">¡Eres parte de nuestro primer evento de diseño!</div>
        </div>
      </section>

      <section className="section activities-section">
        <div className="activity-card">
          <div className="card-header">
            <h3>Microcharlas con expertos</h3>
            <div className="location-tag location-ceditec">
              <img src={LocationIcon} alt="Icono de ubicación" className="location-icon" />
              <span>CEDITEC</span>
            </div>
          </div>
          <div className="card-checkbox">
          </div>
        </div>

        <div className="activity-card">
          <div className="card-header">
            <h3>Experiencia interactiva</h3>
            <div className="location-tag location-nzeb">
              <img src={LocationIcon} alt="Icono de ubicación" className="location-icon" />
              <span>NZEB</span>
            </div>
          </div>
          <div className="card-checkbox"></div>
        </div>

        <div className="activity-card">
          <div className="card-header">
            <h3>Exhibición de proyectos</h3>
            <div className="location-tag location-icas">
              <img src={LocationIcon} alt="Icono de ubicación" className="location-icon" />
              <span>Atrio del ICAS</span>
            </div>
          </div>
          <div className="card-checkbox"></div>
        </div>
        <div className="activity-card activity-card-projection">
          <div className="card-header">
            <h3>Proyección de cortos animados</h3>
            <div className="location-tag location-icas-projection">
              <img src={LocationIcon} alt="Icono de ubicación" className="location-icon" />
              <span>Atrio del ICAS</span>
            </div>
          </div>
          <div className="card-checkbox"></div>
        </div>
      </section>

      <section className="section speakers-section">
        

        <h2>Conoce a nuestros ponentes</h2>
        <div className="speakers-grid">
          <div className="speaker-card">
            <img src={Speaker1} alt="Ponente 1" className="speaker-img" />
            <div className="speaker-info">
              <span className="speaker-name">Nombre Apellido</span>
              <span className="speaker-role">Cargo o profesión</span>
            </div>
          </div>
          <div className="speaker-card">
            <img src={Speaker2} alt="Ponente 2" className="speaker-img" />
            <div className="speaker-info">
              <span className="speaker-name">Nombre Apellido</span>
              <span className="speaker-role">Cargo o profesión</span>
            </div>
          </div>
          <div className="speaker-card">
            <img src={Speaker3} alt="Ponente 3" className="speaker-img" />
            <div className="speaker-info">
              <span className="speaker-name">Nombre Apellido</span>
              <span className="speaker-role">Cargo o profesión</span>
            </div>
          </div>
          <div className="speaker-card">
            <img src={Speaker4} alt="Ponente 4" className="speaker-img" />
            <div className="speaker-info">
              <span className="speaker-name">Nombre Apellido</span>
              <span className="speaker-role">Cargo o profesión</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section info-section">
        
        <div className="map-section">
        <h2 className="text">¿Cómo llegar a las exposiciones?</h2>
          <img src={Mapa} alt="Mapa del evento" className="map-image" />
          <button className="map-button" onClick={() => navigate("/map")}>Ver mapa</button>
        </div>

        <div className="social-media-section">
          <p>Mantente al día de las novedades que vienen en</p>
          <p className="design-uca-text">Diseño UCA</p>
          <h3>Síguenos en nuestras redes</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><img src={FacebookIcon} alt="Facebook" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><img src={InstagramIcon} alt="Instagram" /></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><img src={TikTokIcon} alt="TikTok" /></a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer"><img src={XIcon} alt="X" /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><img src={YoutubeIcon} alt="YouTube" /></a>
          </div>
        </div>

        <footer className="footer-info">
          <p>Universidad Centroamericana José Simeón Cañas</p>
          <p>Todos los derechos reservados</p>
        </footer>
      </section>
    </div>
  );
}

export default LandingPage;