import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SubscribePage.css";
import Footer from "../components/Footer/Footer";
import Logo from "../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png";
import sticker1 from "../assets/stickers/elemento4.png";
import sticker2 from "../assets/stickers/elemento6.png";
import sticker3 from "../assets/stickers/elemento7.png";
import sticker4 from "../assets/stickers/elemento8.png";
import { auth, db, functions, generateToken } from '../firebase/firebase'; 
import { signInAnonymously } from 'firebase/auth';
import { doc, runTransaction, setDoc } from 'firebase/firestore';
import { httpsCallable } from "firebase/functions";

import FormInput from "../components/FormInput/FormInput";
import { eventStartDate, postEventDate } from "../config";
import { toast } from "react-toastify"; 

// --- INICIO DE CAMBIOS PARA SONIDO ---

// 1. Define la ruta de tu sonido (debe estar en public/sounds/noti.mp3)
const soundPath = "/duca/sounds/noti.mp3";

// 2. Crea una función de ayuda para reproducir el sonido
const playSound = () => {
  try {
    // Crea una nueva instancia cada vez para evitar errores de interrupción
    const audio = new Audio(soundPath); 
    audio.play().catch(e => console.warn("No se pudo reproducir el sonido:", e));
  } catch (e) {
    console.error("Error al crear el objeto Audio:", e);
  }
};
// --- FIN DE CAMBIOS PARA SONIDO ---


const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
const friendlyDate = eventStartDate.toLocaleDateString("es-SV", dateOptions);
const friendlyTime = eventStartDate.toLocaleTimeString("es-SV", timeOptions);
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
    return assignedTopic;
}


function SubscribePage() {
    const [currentStep, setCurrentStep] = useState(2);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [isValidating, setIsValidating] = useState(true);

    // --- LÓGICA DE NAVEGACIÓN Y REDIRECCIÓN ---
    useEffect(() => {
        const userLog = localStorage.getItem('userLog');
        const now = new Date();

        const checkUserAndDate = async () => {
            try {
                if (userLog) {
                    navigate('/');
                    return;
                }
                if (now >= postEventDate) {
                    navigate("/pevent");
                } else if (now >= eventStartDate) {
                    navigate("/landing");
                } else {
                    setIsValidating(false);
                }
            } catch (err) {
                console.error("Error durante la validación:", err);
                setIsValidating(false);
            }
        };

        checkUserAndDate();

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


    const handleRegistration = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { email, name, company } = formData;

        try {
            const userCredential = await signInAnonymously(auth);
            const user = userCredential.user;

            // 3. Reproduce sonido ANTES del toast
            playSound(); 
            toast.info("Por favor, acepta los permisos de notificación (solicitud externa).");

            const [tokenResult, assignedTopic] = await Promise.all([
                generateToken(), 
                assignTopic()
            ]);

            const fcmToken = tokenResult.success ? tokenResult.token : null;

            if (fcmToken) {
                playSound(); // 3. Reproduce sonido
                toast.success("¡Permiso aceptado y token obtenido!");
            } else {
                playSound(); // 3. Reproduce sonido
                toast.warn("No se aceptaron las notificaciones. Puedes activarlas luego.");
            }

            const registrationDate = new Date().toISOString();
            const userData = {
                name,
                email,
                company: company || "N/A",
                registeredAt: registrationDate,
                topic: assignedTopic,
                fcmToken: fcmToken,
            };

            const promises = [
                setDoc(doc(db, "Usuarios", user.uid), userData),
            ];

            if (fcmToken && assignedTopic) {
                promises.push(
                    subscribeToTopicCallable({
                        token: fcmToken,
                        topic: assignedTopic,
                        userId: user.uid
                    })
                );
            }
            
            await Promise.all(promises);

            localStorage.setItem('userLog', user.uid);
            playSound(); // 3. Reproduce sonido
            toast.success("¡Registro completado!");
            setCurrentStep(3);
        } catch (err) {
            console.error("Error al registrar:", err);
            let errorMessage = "Error desconocido. Inténtalo de nuevo.";

            if (err.code) {
                errorMessage = `Error: ${err.code}. Revisa la consola.`;
            } else if (err.message) {
                 errorMessage = `Error: ${err.message}.`;
            }
            
            setError(errorMessage);
            playSound(); // 3. Reproduce sonido
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const handleNext = () => {
        if (currentStep === 3) {
            navigate("/");
        }
    };

    if (isValidating) {
        return (
            <div className="SubscribePage page-background--radial-blue-top flex items-center justify-center min-h-screen">
                <div className="text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Validando acceso...</h2>
                    <p>Por favor, espera un momento.</p>
                </div>
            </div>
        );
    }

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

                {/* PASO 2 (Formulario) */}
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
                                {loading ? 'Registrando y activando notificaciones...' : 'Confirmar'}
                            </button>
                            {error && <p className="FormInput__error">{error}</p>}
                        </form>
                    </div>
                )}

                {/* PASO 3 (Gracias) */}
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
                <span className={`SubscribePage__step-dot ${currentStep === 2 ? "SubscribePage__step-dot--active" : ""}`}></span>
                <span className={`SubscribePage__step-dot ${currentStep === 3 ? "SubscribePage__step-dot--active" : ""}`}></span>
            </div>
            <Footer />
        </div>
    );
}

export default SubscribePage;