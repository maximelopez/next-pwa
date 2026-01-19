"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correction des icônes Leaflet pour Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapLocationProps {
  width?: string | number;
  height?: string | number;
  zoom?: number;
}

export default function MapLocation({
  width = "100%",
  height = 400,
  zoom = 13,
}: MapLocationProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Géolocalisation non supportée par ce navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setError("Autorisation refusée ou erreur de géolocalisation.");
      }
    );
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!position) return <p>📍 Localisation en cours...</p>;

  return (
    <div style={{ width, height }}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ width: 600, height: 400 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>📍 Vous êtes ici</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
