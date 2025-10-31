import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CountdownPage.css";
import Logo from "../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png";
import Footer from "../components/Footer/Footer";
import { eventStartDate, postEventDate } from "../config";


function CountdownPage() {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [Logged, setLogged] = useState(false);

    useEffect(() => {
        const now = new Date();

        if (now >= postEventDate) {
            navigate("/pevent");
            return;
        }

        if (now >= eventStartDate) {
            navigate("/welcome");
            return;
        }

        const interval = setInterval(() => {
            const now = new Date();
            const difference = eventStartDate - now;
            const loggedUser = localStorage.getItem('userLog');

            if(loggedUser){
                setLogged(true);
            }

            if (difference <= 0) {
                clearInterval(interval);
                navigate("/welcome");
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);

    }, [navigate]);

    return (
        <div className="CountdownPage page-background--radial">
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

            <button
                className="btn btn-acento"
                onClick={() => {
                    navigate("/welcome");
                }}>
                {new Date() >= eventStartDate ? "Entrar al evento" :(Logged ? "Muy pronto" : "¡Inscríbete Ya!") }
            </button>

            <p className="CountdownPage__message">
                Te invitamos a que descubras la nueva experiencia que hemos <br /> <b>diseñado</b> para ti.
            </p>
            <Footer />
        </div>

    );
}

export default CountdownPage;