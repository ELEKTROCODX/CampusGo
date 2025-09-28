import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CountdownPage.css";
import Logo from "../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png";

function CountdownPage() {
    const navigate = useNavigate();

    const targetDate = new Date("2025-10-30T10:00:00");
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
        <div className="countdown-container">
            <img src={Logo} alt="Logo" className="countdown-logo" />
            <h1 className="countdown-title">¡Prepárate para el lanzamiento!</h1>

            <div className="countdown-timer">
                <div className="time-box">
                    <span className="time">{timeLeft.days}</span>
                    <span className="label">Días</span>
                </div>
                <div className="time-box">
                    <span className="time">{timeLeft.hours}</span>
                    <span className="label">Horas</span>
                </div>
                <div className="time-box">
                    <span className="time">{timeLeft.minutes}</span>
                    <span className="label">Min</span>
                </div>
                <div className="time-box">
                    <span className="time">{timeLeft.seconds}</span>
                    <span className="label">Seg</span>
                </div>
            </div>

            <button className="countdown-btn" onClick={() => navigate("/welcome")}>
                ¡Muy pronto!
            </button>
            <p className="countdown-message">Te invitamos a que descubras la nueva experiencia que hemos <b>diseñando</b> para ti.</p>

        </div>
    );
}

export default CountdownPage;
