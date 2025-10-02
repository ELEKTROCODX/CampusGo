// src/hooks/useQRScanner.js
import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export function useQRScanner(onScan) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  async function startCamera() {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }
      setScanning(true);
      tick();
    } catch (err) {
      alert("Error accediendo a la cámara: " + err.message);
    }
  }

  function stopCamera() {
    setScanning(false);
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  }

  function tick() {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code?.data) {
        onScan(code.data.trim());
        stopCamera();
        return;
      }
    }
    requestAnimationFrame(tick);
  }

  return { videoRef, canvasRef, startCamera, stopCamera, scanning };
}