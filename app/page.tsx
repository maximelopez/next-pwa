"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCity = () => {
    if (!navigator.geolocation) {
      setError("Géolocalisation non supportée.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();

          // Selon le pays, la ville peut être city, town ou village
          const cityName =
            data.address.city ||
            data.address.town ||
            data.address.village;

          setCity(cityName || "Ville inconnue");
          setError(null);
        } catch (err) {
          setError("Erreur lors de la récupération de la ville.");
        }
      },
      () => {
        setError("Autorisation refusée.");
      }
    );
  };

  useEffect(() => {
    getCity();
  }, []);

  return (
    <div className="container">
      <h1>Bienvenue sur mon application Next.js</h1>

      {city && <p>📍 Vous êtes à : <strong>{city}</strong></p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
