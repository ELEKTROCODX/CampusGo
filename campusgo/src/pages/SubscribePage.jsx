import React, { useState, useEffect } from "react"; // 1. Importar useEffect
import { useNavigate, Link } from "react-router-dom"; 
import "./SubscribePage.css"; 
import Footer from "../components/Footer/Footer"
import Logo from "../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png";
import sticker1 from "../assets/stickers/elemento4.png";
import sticker2 from "../assets/stickers/elemento6.png";
import sticker3 from "../assets/stickers/elemento7.png";
import sticker4 from "../assets/stickers/elemento8.png";
import { auth, db, functions } from '../firebase/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, runTransaction, setDoc, Transaction } from 'firebase/firestore';
import FormInput from "../components/FormInput/FormInput";
import { httpsCallable } from "firebase/functions";
import { eventStartDate, postEventDate } from "../config"; 
const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
const friendlyDate = eventStartDate.toLocaleDateString("es-SV", dateOptions);
const friendlyTime = eventStartDate.toLocaleTimeString("es-SV", timeOptions);

function SubscribePage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const topics = ["Grupo_1", "Grupo_2","Grupo_3"];
    const subscribeToTopicCallable = httpsCallable(functions,'subscribeUserToTopicCallable')

    useEffect(() => {
        const now = new Date();

        if (now >= postEventDate) {
            // Si el evento ya terminó, no te puedes inscribir.
            navigate("/pevent"); 
        } else if (now >= eventStartDate) {
            navigate("/welcome"); 
        }
        // Si es "antes", el useEffect no hace nada y la página se muestra.
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

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData);
        setCurrentStep(3);
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const {email, name, company} = formData;

        try{
            const userCredential = await signInAnonymously(auth);
            const user = userCredential.user;

            const fcmToken = localStorage.getItem('fcmToken');
            const registrationDate = new Date().toISOString();

            let assignedTopic = null;

            await runTransaction(db,async(Transaction) => {
                const counterRef = doc(db,"Metadatos","asignacionTemas");
                const counterDoc = await Transaction.get(counterRef);

                let currentIndex = 0;
                if(counterDoc.exists()){
                    currentIndex = counterDoc.data().lastAssignedIndex;
                }

                assignedTopic = topics[currentIndex % topics.length];
                const nextIndex = (currentIndex + 1) % topics.length;

                if (counterDoc.exists()) {
                    // Si el documento existe, actualiza el índice para el siguiente usuario
                    Transaction.update(counterRef, { lastAssignedIndex: nextIndex });
                } else {
                    // Si es la primera vez (el documento no existe), crea el documento del contador
                    Transaction.set(counterRef, { lastAssignedIndex: nextIndex });
                }
            })

            const userData = {
                name,
                email,
                company: company || "N/A",
                topic: assignedTopic,
                registeredAt: registrationDate,
            };


            if(fcmToken){
                userData.fcmToken = fcmToken;
                const result = await subscribeToTopicCallable({ 
                    token: fcmToken, 
                    topic: assignedTopic,
                    userId: user.uid 
                });
                console.log("Result callable: ",result);
            }
            console.log("User a registrar: ", userData);
            await setDoc(doc(db,"Usuarios",user.uid), userData);
            console.log("Usuario registrado y datos guardados: ", user.uid);
            localStorage.setItem('userLog',user.uid);
            console.log("Usuario registrado y asignado al tema:", assignedTopic);
            
            setCurrentStep(3);
        }catch (err) {
            console.error("Error al registrar:", err.message);
            
            // Si el error es un problema de permisos de Firestore, mostrar un mensaje amigable
            if (err.code === 'permission-denied' || err.message.includes('insufficient permissions')) {
                setError("Hubo un error de permisos. Asegúrate de que las reglas de Firestore están configuradas para 'create' en la colección 'Usuarios'.");
            } else {
                setError("Error en el registro: " + err.message);
            }
        } finally {
            setLoading(false);
        }

    }

    const handleNext = () => {
        if (currentStep === 1) {
            setCurrentStep(2);
        } else if (currentStep === 3) {
            navigate("/welcome");
        }
    };

    return (
        <div className="SubscribePage page-background--radial-blue-top">
            <Link to="/">
                <img src={Logo} alt="UCA Logo" className="logo" />
            </Link>

            <img src={sticker1} alt="" className="SubscribePage__sticker SubscribePage__sticker--planet" />
            <img src={sticker2} alt="" className="SubscribePage__sticker SubscribePage__sticker--wifi" />
            <img src={sticker3} alt="" className="SubscribePage__sticker SubscribePage__sticker--cat" />
            <img src={sticker4} alt="" className="SubscribePage__sticker SubscribePage__sticker--cassette" />

            <div className="SubscribePage__content">
                {currentStep === 1 && (
                    <div className="SubscribePage__step SubscribePage__fade-in">
                        <h2>Se parte del <br /><b>Networking de diseño</b> más disruptivo de El Salvador</h2>
                        <p>Te invitamos a que seas parte del primer evento de diseño de la UCA</p>

                        <div className="SubscribePage__event-info">
                            <p><strong>Día y hora del evento:</strong><br />{friendlyDate} – {friendlyTime}</p>
                            <p><strong>Lugar:</strong><br />UCA Edificio CEDITEC</p>
                        </div>

                        <button className="btn btn-acento" onClick={handleNext}>
                            Quiero participar
                        </button>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="SubscribePage__step SubscribePage__fade-in">
                        <h2>Crear perfil</h2>
                        <p>Este perfil nos ayudará a saber el total de participantes y a preparar las sorpresas del evento</p>
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
                            <button type="submit" className="btn btn-acento">Confirmar</button>
                        </form>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="SubscribePage__step SubscribePage__fade-in">
                        <h2>Gracias por compartir tus datos</h2>
                        <p>
                            ¡Te esperamos en el <b>primer evento de diseño de la UCA!</b>
                        </p>

                        <div className="SubscribePage__event-info">
                            <p><strong>Día y hora del evento:</strong><br />{friendlyDate} – {friendlyTime}</p>
                            <p><strong>Lugar:</strong><br />UCA Edificio CEDITEC</p>
                        </div>

                        <button className="btn btn-acento" onClick={handleNext}>
                            Finalizar
                        </button>
                    </div>
                )}
            </div>
            <div className="SubscribePage__step-indicator">
                <span className={`SubscribePage__step-dot ${currentStep === 1 ? "SubscribePage__step-dot--active" : ""}`}></span>
                <span className={`SubscribePage__step-dot ${currentStep === 2 ? "SubscribePage__step-dot--active" : ""}`}></span>
                <span className={`SubscribePage__step-dot ${currentStep === 3 ? "SubscribePage__step-dot--active" : ""}`}></span>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default SubscribePage;