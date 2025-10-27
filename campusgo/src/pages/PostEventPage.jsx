import React from 'react';
import './PostEventPage.css'; // CSS Limpio
import LogoUCA from '../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png';
import Sticker1 from '../assets/stickers/elemento1.png';
import Sticker2 from '../assets/stickers/elemento2.png';
import Sticker3 from '../assets/stickers/elemento3.png';

// 1. Importar el nuevo componente Footer
import Footer from '../components/Footer/Footer';

function PostEventPage() {
  return (
    // 2. Aplicar BEM y la nueva clase de fondo
    <div className="PostEventPage page-background--radial-dark">
      {/* Stickers decorativos */}
      <img src={Sticker1} alt="Sticker 1" className="PostEventPage__sticker PostEventPage__sticker--1" />
      <img src={Sticker2} alt="Sticker 2" className="PostEventPage__sticker PostEventPage__sticker--2" />
      <img src={Sticker3} alt="Sticker 3" className="PostEventPage__sticker PostEventPage__sticker--3" />

      {/* Contenido principal */}
      <div className="PostEventPage__content">
        <img src={LogoUCA} alt="Logo UCA" className="logo" />

        <h1 className="PostEventPage__title">Edición 2025</h1>
        <p className="PostEventPage__subtitle">
          Nuevamente te agradecemos por haber sido parte de este evento.
        </p>

        <h2 className="PostEventPage__quote">
          Diseño UCA ha venido para quedarse…
        </h2>

        {/* 3. Usar clases de botón globales en la etiqueta <a> */}
        <a
          href="https://www.uca.edu.sv"
          className="btn btn-acento" 
          target="_blank"
          rel="noopener noreferrer"
        >
          Nuestra Web
        </a>
      </div>

      {/* 4. ELIMINAR el .social-media-section y .footer-info */}
      
      {/* 5. AÑADIR el componente Footer reutilizable */}
      <Footer />
    </div>
  );
}

export default PostEventPage;