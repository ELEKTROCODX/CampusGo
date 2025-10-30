import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SubscribePage.css";
import Footer from "../components/Footer/Footer";
import Logo from "../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png";
import sticker1 from "../assets/stickers/elemento4.png";
import sticker2 from "../assets/stickers/elemento6.png";
import sticker3 from "../assets/stickers/elemento7.png";
import sticker4 from "../assets/stickers/elemento8.png";

// Importa TODO lo de firebase (tu código)
import { auth, db, functions, generateToken } from '../firebase/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, runTransaction, setDoc } from 'firebase/firestore';
import { httpsCallable } from "firebase/functions";

import FormInput from "../components/FormInput/FormInput";
import { eventStartDate, postEventDate } from "../config";
import { toast } from "react-toastify";

// Formato de fechas (tu código)
const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
const friendlyDate = eventStartDate.toLocaleDateString("es-SV", dateOptions);
const friendlyTime = eventStartDate.toLocaleTimeString("es-SV", timeOptions);

// Lógica de Tópicos (tu código)
const topics = ["Grupo_1", "Grupo_2", "Grupo_3", "Grupo_4"];
const subscribeToTopicCallable = httpsCallable(functions, 'subscribeUserToTopicCallable');

async function assignTopic() {
    let assignedTopic = null;
    await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, "Metadatos", "asignacionTemas");
        const counterDoc = await transaction.get(counterRef);
        let currentIndex = 0;
        if (counterDoc.exists()) {
            currentIndex = counterDoc.data().lastAssignedIndex;
        }
        assignedTopic = topics[currentIndex % topics.length];
        const nextIndex = (currentIndex + 1) % topics.length;
        if (counterDoc.exists()) {
            transaction.update(counterRef, { lastAssignedIndex: nextIndex });
        } else {
            transaction.set(counterRef, { lastAssignedIndex: nextIndex, topics: topics });
        }
    });
    console.log("Tópico asignado:", assignedTopic);
    return assignedTopic;
}


function SubscribePage() {
    // 1. CORRECCIÓN: Inicia en el paso 1 (info), no en el formulario
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const now = new Date();

    // Lógica de redirección por fecha (tu código)
    useEffect(() => {
        if (now >= postEventDate) {
            navigate("/pevent");
        } else if (now >= eventStartDate) {
            navigate("/subscribe");
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Función de registro (tu código - está perfecto)
    const handleRegistration = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { email, name, company } = formData;

        try {
            toast.info("Por favor, acepta los permisos de notificación.");
            const tokenResult = await generateToken();
            const fcmToken = tokenResult.success ? tokenResult.token : null;

            if (fcmToken) {
                toast.success("¡Permiso aceptado!");
            } else {
                toast.warn("No se aceptaron las notificaciones. Puedes activarlas luego.");
            }

            const assignedTopic = await assignTopic();
            const userCredential = await signInAnonymously(auth);
            const user = userCredential.user;
            const registrationDate = new Date().toISOString();

            const userData = {
                name,
                email,
                company: company || "N/A",
                registeredAt: registrationDate,
                topic: assignedTopic,
                fcmToken: fcmToken,
            };

            if (fcmToken && assignedTopic) {
                await subscribeToTopicCallable({
                    token: fcmToken,
                    topic: assignedTopic,
                    userId: user.uid
                });
                console.log("Usuario suscrito al tópico:", assignedTopic);
            }

            await setDoc(doc(db, "Usuarios", user.uid), userData);
            console.log("Usuario registrado y datos guardados: ", user.uid);
            localStorage.setItem('userLog', user.uid);

            // 2. CORRECCIÓN: Tu código original avanzaba al 3, lo cual es correcto
            setCurrentStep(3);
        } catch (err) {
            console.error("Error al registrar:", err.message);
            if (err.code === 'permission-denied' || err.message.includes('insufficient permissions')) {
                setError("Hubo un error de permisos. Asegúrate de que las reglas de Firestore están configuradas para 'create' en la colección 'Usuarios'.");
            } else {
                setError("Error en el registro: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    // 3. handleNext (tu código - está perfecto)
    const handleNext = () => {
        if (currentStep === 1) {
            setCurrentStep(2); // Va al formulario
        } else if (currentStep === 3 && now >= eventStartDate) {
            navigate("/landing"); // Va a la landing
        } else {
            navigate("/")
        }
    };

    return (
        <div className="SubscribePage page-background--radial-blue-top">
            <Link to="/">
                <img src={Logo} alt="UCA Logo" className="logo" />
            </Link>

            {/* Stickers */}
            <img src={sticker1} alt="" className="SubscribePage__sticker SubscribePage__sticker--planet" />
            <img src={sticker2} alt="" className="SubscribePage__sticker SubscribePage__sticker--wifi" />
            <img src={sticker3} alt="" className="SubscribePage__sticker SubscribePage__sticker--cat" />
            <img src={sticker4} alt="" className="SubscribePage__sticker SubscribePage__sticker--cassette" />

            <div className="SubscribePage__content">

                {/* --- PASO 1: INFO --- */}
                {currentStep === 1 && (
                    <div className="SubscribePage__step SubscribePage__fade-in">
                        <h2>Se parte del <br /><b>Networking de diseño</b> más disruptivo de El Salvador</h2>
                        <p>Te invitamos a que seas parte del primer evento de diseño de la UCA</p>
                        <div className="SubscribePage__event-info">
                            <p><strong>Día y hora del evento:</strong><br />{friendlyDate} – {friendlyTime}</p>
                            <p><strong>Lugar:</strong><br />UCA Edificio ICAS</p>
                        </div>
                        <button className="btn btn-acento" onClick={handleNext}>
                            Quiero participar
                        </button>
                    </div>
                )}

                {/* --- PASO 2: FORMULARIO --- */}
                {currentStep === 2 && (
                    <div className="SubscribePage__step SubscribePage__fade-in">
                        <h2>Crear perfil</h2>
                        <form className="card card--form" onSubmit={handleRegistration}>
                            <FormInput
                                label="Nombre y apellido*"
                                name="name"
                                placeholder="Nombre completo"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                label="Correo electrónico*"
                                type="email"
                                name="email"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                label="Empresa"
                                name="company"
                                placeholder="Empresa"
                                value={formData.company}
                                onChange={handleChange}
                            />
                            <button
                                type="submit"
                                className="btn btn-acento"
                                disabled={loading}
                            >
                                {loading ? 'Registrando...' : 'Confirmar'}
                            </button>
                            {error && <p className="FormInput__error">{error}</p>}
                        </form>
                    </div>
                )}

                {/* --- PASO 3: GRACIAS --- */}
                {currentStep === 3 && (
                    <div className="SubscribePage__step SubscribePage__fade-in">
                        <h2>Gracias por compartir tus datos</h2>
                        <p>¡Te esperamos en el <b>primer networking de Diseño de la UCA!</b></p>
                        <div className="SubscribePage__event-info">
                            <p><strong>Día y hora del evento:</strong><br />{friendlyDate} – {friendlyTime}</p>
                            <p><strong>Lugar:</strong><br />UCA Edificio ICAS</p>
                        </div>
                        <button className="btn btn-acento" onClick={handleNext}>
                            Finalizar
                        </button>
                    </div>
                )}
            </div>

            {/* Indicador de pasos */}
            <div className="SubscribePage__step-indicator">
                <span className={`SubscribePage__step-dot ${currentStep === 1 ? "SubscribePage__step-dot--active" : ""}`}></span>
                <span className={`SubscribePage__step-dot ${currentStep === 2 ? "SubscribePage__step-dot--active" : ""}`}></span>
                <span className={`SubscribePage__step-dot ${currentStep === 3 ? "SubscribePage__step-dot--active" : ""}`}></span>
            </div>
            <Footer />
        </div>
    );
}

export default SubscribePage;