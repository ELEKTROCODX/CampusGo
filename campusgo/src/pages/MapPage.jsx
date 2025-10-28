import React from 'react';
import './MapPage.css'; 
import LogoUCA from '../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png';
import { Link, useNavigate } from 'react-router-dom'; 

function MapPage() {
    const navigate = useNavigate(); 
    const ucaMapEmbedUrl =
        "https://www.google.com/maps?q=Universidad+Centroamericana+José+Simeón+Cañas+(UCA),+El+Salvador&output=embed";

    return (
        <div className="MapPage page-background--radial-purple">
            <div className="MapPage__content">
                
                <Link to="/">
                    <img src={LogoUCA} alt="Logo UCA 60 Aniversario" className="logo" />
                </Link>

                <h1 className="MapPage__title">Aquí puedes ver el mapa de la universidad</h1>

                <div className="MapPage__map-window">
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

                <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
                    Regresar
                </button>

            </div>
        </div>
    );
}

export default MapPage;