"use client";

import { useEffect, useState, useRef } from "react";

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia non supporté par ce navigateur");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Erreur accès caméra :", err);
      }
    }

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture la photo
  const takePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Inverser horizontalement
    ctx.translate(canvas.width, 0); // déplace l'origine à droite
    ctx.scale(-1, 1);               // inverse horizontalement
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    setPhoto(dataUrl);
  };

  return (
    <div>
      <div className="camera-section">
        <video
          ref={videoRef}
          style={{ width: "100%", maxWidth: 400, background: "#000", transform: "scaleX(-1)" }}
          autoPlay
          muted
          playsInline
        />

        <button onClick={takePhoto} className="camera-btn">
          Prendre une photo
        </button>
      </div> 

      {photo && (
        <div>
          <h4>Photo capturée :</h4>
          <img src={photo} alt="Capture" style={{ width: "100%", maxWidth: 400 }} />
        </div>
      )}

      {/* Canvas caché pour capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

    </div>
  );
}
