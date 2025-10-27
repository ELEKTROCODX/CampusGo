import React from 'react';
import './Footer.css';

// Importar todos los iconos
import FacebookIcon from "../../assets/icons/facebook.png";
import InstagramIcon from "../../assets/icons/instagram.png";
import TikTokIcon from "../../assets/icons/tiktok.png";
import XIcon from "../../assets/icons/twitter.png"; 
import YoutubeIcon from "../../assets/icons/youtube.png";

function Footer() {
  return (
    // Usamos un <section> que envuelve ambas partes
    <section className="AppFooter">
      <div className="SocialMedia">
        <p>Mantente al día de las novedades que vienen en</p>
        <p className="SocialMedia__brand-text">Diseño UCA</p>
        <h3 className="SocialMedia__subtitle">Síguenos en nuestras redes</h3>
        <div className="SocialMedia__icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><img src={FacebookIcon} alt="Facebook" /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><img src={InstagramIcon} alt="Instagram" /></a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><img src={TikTokIcon} alt="TikTok" /></a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer"><img src={XIcon} alt="X" /></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><img src={YoutubeIcon} alt="YouTube" /></a>
        </div>
      </div>

      <footer className="FooterInfo">
        <p>Universidad Centroamericana José Simeón Cañas</p>
        <p>Todos los derechos reservados</p>
      </footer>
    </section>
  );
}

export default Footer;