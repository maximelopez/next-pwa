"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW enregistré", reg))
        .catch((err) => console.error("Erreur SW:", err));
    }
  }, []);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
