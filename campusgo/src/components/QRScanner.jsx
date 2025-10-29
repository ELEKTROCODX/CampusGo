import React from "react";
import { useQRScanner } from "../hooks/useQRScanner";

export default function QRScanner({ onDetected, onClose }) {
  const { videoRef, canvasRef, startCamera, stopCamera, scanning } =
    useQRScanner(handleScan);

  function handleScan(content) {
    onDetected(content);
  }

  return (
    <div className="qr-scanner-container">
      <h2>Escanea un QR</h2>
      <video ref={videoRef} hidden={!scanning} />
      <canvas ref={canvasRef} hidden />
      <div className="qr-controls">
        {!scanning ? (
          <button onClick={startCamera}>Iniciar escaneo</button>
        ) : (
          <button onClick={stopCamera}>Detener</button>
        )}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}