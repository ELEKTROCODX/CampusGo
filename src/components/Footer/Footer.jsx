import React from 'react';
import './Footer.css';

import FacebookIcon from "../../assets/icons/facebook.png";
import InstagramIcon from "../../assets/icons/instagram.png";
import TikTokIcon from "../../assets/icons/tiktok.png";
import XIcon from "../../assets/icons/twitter.png"

function Footer() {
  return (
    <section className="AppFooter">
      <div className="SocialMedia">
        <p className="SocialMedia__brand-text">DISEÑO EN LA UCA</p>
        <div className="SocialMedia__icons">
          <a href="https://facebook.com/departamentodeorganizacion.delespacio/?locale=es_LA" target="_blank" rel="noopener noreferrer"><img src={FacebookIcon} alt="Facebook" /></a>
          <a href="https://instagram.com/ucadiseno/" target="_blank" rel="noopener noreferrer"><img src={InstagramIcon} alt="Instagram" /></a>
          <a href="https://tiktok.com/@disenouca" target="_blank" rel="noopener noreferrer"><img src={TikTokIcon} alt="TikTok" /></a>
          <a href="https://x.com/UCA_ES?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" target="_blank" rel="noopener noreferrer"><img src={XIcon} alt="TikTok" /></a>
        </div>
      </div>

      <footer className="FooterInfo">
        <a href="https://uca.edu.sv/">
          <p>Universidad Centroamericana "José Simeón Cañas"</p>
        </a>
        <p>© Todos los derechos reservados</p>
      </footer>
    </section>
  );
}

export default Footer;