"use client";

import { useState, useEffect } from "react";

export default function VibrationButton() {
  const [supported, setSupported] = useState(false); // API vibration dispo
  const [message, setMessage] = useState(""); // Feedback visuel
  const [isMobile, setIsMobile] = useState(false); // Détection appareil mobile

  useEffect(() => {
    // Vérifie côté client si navigator.vibrate est supporté
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      setSupported(true);
    }

    // Détection simple du mobile via userAgent
    if (typeof window !== "undefined") {
      setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    }
  }, []);

  const vibrate = () => {
    if (!supported) {
      setMessage("La vibration n'est pas supportée sur cet appareil.");
      return;
    }

    // Déclenche la vibration : 200ms
    const success = navigator.vibrate(200);

    if (success) {
      setMessage(
        isMobile
          ? "Vibration envoyée ✅"
          : "Vibration envoyée ✅ (cet appareil ne peut pas vibrer physiquement)"
      );
    } else {
      // API existe mais vibration impossible (PC, laptop, etc.)
      setMessage("La vibration n'est pas supportée sur cet appareil.");
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <button
        onClick={vibrate}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Tester la vibration
      </button>
      {message && <p style={{ marginTop: "0.5rem" }}>{message}</p>}
    </div>
  );
}
