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

        await updateDoc(userRef, { fcmToken: tokenOrId });

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

export function isIosNotPwa() {
  const ua = window.navigator.userAgent.toLowerCase();
  const isIos =
    /iphone|ipad|ipod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); 

  const isStandalone = window.navigator.standalone === true;
  return isIos && !isStandalone;
}

function getIOSVersion() {
  const userAgent = navigator.userAgent;
  
  // 1. Verificar si es un dispositivo iOS (iPhone, iPad, iPod)
  if (!/(iPhone|iPad|iPod)/i.test(userAgent)) {
    return null; // No es iOS
  }

  // 2. Usar una expresión regular para encontrar el patrón 'OS X_Y(_Z)'
  // El grupo de captura (\d+) extrae los números de versión.
  const versionMatch = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);

  if (versionMatch) {
    // versionMatch[1] = Major (ej: 17)
    // versionMatch[2] = Minor (ej: 1)
    
    const major = parseInt(versionMatch[1], 10);
    const minor = parseInt(versionMatch[2] || 0, 10); // Usa 0 si no hay versión menor
    
    return [major, minor];
  }

  return null;
}

export function checkAndWarnIOSVersion(requiredMajor, requiredMinor) {
  const iosVersion = getIOSVersion();

  if (iosVersion) {
    const [userMajor, userMinor] = iosVersion;
    const isBelowRequired = 
      userMajor < requiredMajor || 
      (userMajor === requiredMajor && userMinor < requiredMinor);

    if (isBelowRequired) {
        console.log(`Versión de iOS (${userMajor}.${userMinor}) No es compatible.`);
        return false;
    } else {
        console.log(`Versión de iOS (${userMajor}.${userMinor}) compatible.`);
        return true;
    }
  } else {
    console.log("No es un dispositivo iOS o no se pudo determinar la versión.");
  }
}
