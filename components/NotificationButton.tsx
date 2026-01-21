"use client";

import { useState, useEffect } from "react";

export default function NotificationButton() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const sendNotification = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return alert("Les notifications ne sont pas supportées ici !");
    }

    if (permission !== "granted") {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") return alert("Permission refusée !");
    }

    new Notification("Salut ! 👋", {
      body: "La notification fonctionne !",
      icon: "/icon1.png",
    });
  };

  if (permission === null) return null;

  return (
    <div>
      <button
        onClick={sendNotification}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Tester la notification
      </button>
    </div>
  );
}
