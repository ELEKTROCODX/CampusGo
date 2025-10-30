import React from 'react';
import './Footer.css';

import FacebookIcon from "../../assets/icons/facebook.png";
import InstagramIcon from "../../assets/icons/instagram.png";
import TikTokIcon from "../../assets/icons/tiktok.png";

function Footer() {
  return (
    <section className="AppFooter">
      <div className="SocialMedia">
        <p>Mantente al día de las novedades que vienen del</p>
        <p className="SocialMedia__brand-text">DISEÑO UCA</p>
        <div className="SocialMedia__icons">
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer"><img src={FacebookIcon} alt="Facebook" /></a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer"><img src={InstagramIcon} alt="Instagram" /></a>
          <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer"><img src={TikTokIcon} alt="TikTok" /></a>
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