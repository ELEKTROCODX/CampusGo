import React from 'react';
import './PostEventPage.css';
import LogoUCA from '../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png';
import Sticker1 from '../assets/stickers/elemento1.png';
import Sticker2 from '../assets/stickers/elemento2.png';
import Sticker3 from '../assets/stickers/elemento3.png';

import Footer from '../components/Footer/Footer';

function PostEventPage() {
  return (
    <div className="PostEventPage page-background--radial-dark">
      <img src={Sticker1} alt="Sticker 1" className="PostEventPage__sticker PostEventPage__sticker--1" />
      <img src={Sticker2} alt="Sticker 2" className="PostEventPage__sticker PostEventPage__sticker--2" />
      <img src={Sticker3} alt="Sticker 3" className="PostEventPage__sticker PostEventPage__sticker--3" />

      <div className="PostEventPage__content">
        <img src={LogoUCA} alt="Logo UCA" className="PostEventPage__logo" />

        <h1 className="PostEventPage__title">Edición 2025</h1>
        <p className="PostEventPage__subtitle">
          Nuevamente te agradecemos por haber sido parte de este evento.
        </p>

        <h2 className="PostEventPage__quote">
          ¡El Diseño en la UCA ha venido para quedarse!
        </h2>
        <br />
        <p className="PostEventPage__subtitle">
          Explora nuestras carreras
        </p>
        <div className="welcome-section__tags">
          <a href="https://uca.edu.sv/carrera/licenciatura-en-diseno-semipresencial/" target="_blank" rel="noopener noreferrer">
            <span className="tag tag--led">LeD</span>
          </a>
          <a href="https://uca.edu.sv/postgrados/ingenieria-y-diseno/diseno-de-productos-y-servicios/" target="_blank" rel="noopener noreferrer">
            <span className="tag tag--medp">MDPS</span>
          </a>
          <a href="https://uca.edu.sv/carrera/arquitectura-presencial/" target="_blank" rel="noopener noreferrer">
            <span className="tag tag--arq">ARQ</span>
          </a>

        </div>

      </div>
      <Footer />
    </div>
  );
}

export default PostEventPage;