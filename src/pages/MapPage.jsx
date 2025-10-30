import React, { useState } from 'react';
import './MapPage.css';
import LogoUCA from '../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png';
import { Link, useNavigate } from 'react-router-dom';
import Footer from "../components/Footer/Footer";

const mapUrls = {
  icas: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1870.6175619343041!2d-89.23820864781874!3d13.681140589059789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f6331d2abc6b48d%3A0xc0f9b179a9109bdf!2sInstituto%20Centroamericano%20de%20Ciencias%20de%20la%20Salud%20(ICAS)!5e1!3m2!1ses-419!2ssv!4v1761684975730!5m2!1ses-419!2ssv",
  ceditec: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1548.5088366417162!2d-89.23787523758598!3d13.680284696449053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f63316e740ee17f%3A0xb5ad743d1e4a79a5!2sCentro%20de%20Dise%C3%B1o%2C%20Innovaci%C3%B3n%20y%20Tecnolog%C3%ADa%20-%20CEDITEC!5e1!3m2!1ses-419!2ssv!4v1761685003826!5m2!1ses-419!2ssv",
  nzeb: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d710.8801132776821!2d-89.23682213670605!3d13.681028668197328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f6331a8c09d1a07%3A0xc0c39486c807f7f3!2sEdificio%20de%20Cero%20Energ%C3%ADa%20Neta(NZEB)%20UCA!5e1!3m2!1ses-419!2ssv!4v1761685027877!5m2!1ses-419!2ssv"
};

function MapPage() {
    const navigate = useNavigate();
    const [currentMapUrl, setCurrentMapUrl] = useState(mapUrls.icas); 

    return (
        <div className="MapPage page-background--radial-purple">
            <div className="MapPage__content">

                <Link to="/">
                    <img src={LogoUCA} alt="Logo UCA 60 Aniversario" className="MapPage__logo" /> 
                </Link>

                <h1 className="MapPage__title">Mapa del Evento</h1>

                <div className="MapPage__location-buttons">
                    <button 
                        className={`btn btn-secondary ${currentMapUrl === mapUrls.ceditec ? 'active' : ''}`} 
                        onClick={() => setCurrentMapUrl(mapUrls.ceditec)}
                    >
                        CEDITEC
                    </button>
                    <button 
                        className={`btn btn-secondary ${currentMapUrl === mapUrls.icas ? 'active' : ''}`} 
                        onClick={() => setCurrentMapUrl(mapUrls.icas)}
                    >
                        ICAS
                    </button>
                    <button 
                        className={`btn btn-secondary ${currentMapUrl === mapUrls.nzeb ? 'active' : ''}`} 
                        onClick={() => setCurrentMapUrl(mapUrls.nzeb)}
                    >
                        N - ZEB
                    </button>
                </div>

                <div className="MapPage__map-window">
                    <iframe
                        src={currentMapUrl} 
                        key={currentMapUrl} 
                        width="100%"
                        height="100%" 
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Mapa del Evento DUCA - Puntos Clave"
                    ></iframe>
                </div>

                <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
                    Regresar
                </button>

            </div>
            <Footer style={{ marginBottom: '2rem' }} /> 
        </div>
    );
}

export default MapPage;