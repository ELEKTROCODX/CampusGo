import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CountdownPage.css";
import Logo from "../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png";

function CountdownPage() {
    const navigate = useNavigate();
    const targetDate = new Date("2025-11-21T10:00:00"); // Lógica del contador (sin cambios)
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        // 2. Aplicar BEM y la nueva clase de fondo
        <div className="CountdownPage page-background--radial">
            
            {/* 3. Usar Link para navegación interna */}
            <Link to="/">
                <img src={Logo} alt="Logo" className="logo" />
            </Link>
            <h1 className="CountdownPage__title">¡Prepárate para el lanzamiento!</h1>

            <div className="CountdownPage__timer">
                <div className="CountdownPage__time-box">
                    <span className="CountdownPage__time-value">{timeLeft.days}</span>
                    <span className="CountdownPage__time-label">Días</span>
                </div>
                <div className="CountdownPage__time-box">
                    <span className="CountdownPage__time-value">{timeLeft.hours}</span>
                    <span className="CountdownPage__time-label">Horas</span>
                </div>
                <div className="CountdownPage__time-box">
                    <span className="CountdownPage__time-value">{timeLeft.minutes}</span>
                    <span className="CountdownPage__time-label">Min</span>
                </div>
                <div className="CountdownPage__time-box">
                    <span className="CountdownPage__time-value">{timeLeft.seconds}</span>
                    <span className="CountdownPage__time-label">Seg</span>
                </div>
            </div>

            {/* 4. Usar la clase de botón global */}
            <button
                className="btn btn-acento"
                onClick={() => {
                    const now = new Date();
                    if (now >= targetDate) {
                        navigate("/welcome");
                    } else {
                        navigate("/subscribe");
                    }
                }}
            >
                {new Date() >= targetDate ? "Entrar al evento" : "¡Inscríbete Ya!"}
            </button>

            <p className="CountdownPage__message">
                Te invitamos a que descubras la nueva experiencia que hemos <b>diseñando</b> para ti.
            </p>

        </div>
    );
}

export default CountdownPage;