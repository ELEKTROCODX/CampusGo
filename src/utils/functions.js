import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp, doc,updateDoc } from "firebase/firestore";

export const isIosSafari = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    /Safari/.test(navigator.userAgent) &&
    !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent)
  );
};

export const isSubscribed = async () => {
  if (!window.OneSignalDeferred) return false;

  return new Promise((resolve) => {
    window.OneSignalDeferred.push(async function (OneSignal) {
      const user = await OneSignal.User.get();
      resolve(!!user.subscriptionId);
    });
  });
};

export const logToFirestore = async (source, message, data = {}) => {
    try {
        // Obtenemos la URL actual para contextualizar el log.
        const currentUrl = window.location.href;
        
        await addDoc(collection(db, "onesignal_logs"), {
            source,
            message,
            ...data,
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent, // Útil para saber el dispositivo exacto
            url: currentUrl,
        });
        console.log(`[LOG SENT] ${source}: ${message}`);
    } catch (error) {
        // Este error es crítico si falla la escritura del log.
        console.error("ERROR CRÍTICO: No se pudo enviar el log a Firestore.", error);
    }
};

export async function handleSubscriptionSuccess(navigate, userId, tokenOrId) {
    if (!userId || !tokenOrId) {
        console.error("handleSubscriptionSuccess: Falta userId o token/ID.");
        return;
    }

    try {
        const userRef = doc(db, "Usuarios", userId);

        await updateDoc(userRef, { ffcmToken: tokenOrId });

        localStorage.setItem('userLog', userId);

        console.log(`Suscripción exitosa para ${userId}. Navegando a la página principal.`);
        navigate("/");

    } catch (error) {
        console.error("Error al finalizar la suscripción en Firestore:", error);
        navigate("/error_page"); 
    }
}

export function isWebView() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;


  if (userAgent.includes('Android') && (userAgent.includes('wv') || userAgent.includes('WebView'))) {
    return true;
  }

  // 2. Indicadores específicos de aplicaciones populares (ejemplos)
  const specificAppIndicators = [
    'FBAV', // Facebook (común en iOS y Android)
    'FBBV', // Facebook App Version
    'Messenger', // Facebook Messenger
    'Instagram', // Instagram
    'Line',      // Line
    'Twitter',   // Twitter (X)
    'VKSA',      // VKontakte
    'QQ',        // QQ Browser
    'MicroMessenger', // WeChat
    'AlipayClient',   // Alipay
    'DingTalk',       // DingTalk
    'Safari/604.1', 
  ];
  
  const uaLower = userAgent.toLowerCase();

  for (const indicator of specificAppIndicators) {
    if (uaLower.includes(indicator.toLowerCase())) {
      return true;
    }
  }

  if (/(iPhone|iPad|iPod).*AppleWebKit(?!.*Safari)/i.test(userAgent)) {
    return true;
  }

  return false;
}

export function isRunningAsPWA() {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  


  if (isIosSafari() && ('standalone' in window.navigator) && (window.navigator.standalone)) {
      return true;
  }

  return false;
}
