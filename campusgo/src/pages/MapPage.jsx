import React from 'react';
import './MapPage.css';
import LogoUCA from '../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png';

function MapPage() {
    // La URL de Google Maps para la UCA en El Salvador incrustada en un iframe.
    const ucaMapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1999.327668580252!2d-89.235989062766757!3d13.680999999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f764a8d46e27303%3A0x884ef9b75271a2a4!2sUniversidad%20Centroamericana%20Jos%C3%A9%20Sime%C3%B3n%20Ca%C3%B1as%20(UCA)!5e0!3m2!1ses!2ssv!4v1727444444444!5m2!1ses!2ssv";

    return (
        <div className="map-page-container">
            <div className="map-content">
                <img src={LogoUCA} alt="Logo UCA 60 Aniversario" className="map-logo" />
                
                <h1 className="map-title">Aquí puedes ver el mapa de la universidad</h1>
                
                <div className="map-window">
                    <iframe
                        src={ucaMapEmbedUrl}
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Mapa de la Universidad Centroamericana José Simeón Cañas (UCA)"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}

export default MapPage;