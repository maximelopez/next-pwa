// app/page.tsx ou n'importe quelle page
"use client";

import dynamic from "next/dynamic";
import BatteryStatus from "@/components/BatteryStatus";
import NotificationButton from "@/components/NotificationButton";
import VibrationButton from "@/components/VibrationButton";

// Import dynamique du composant Leaflet pour éviter SSR
const MapLocation = dynamic(() => import("@/components/MapLocation"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h1>Bienvenue sur mon application Next.js</h1>
      <div>Cette application est une PWA qui utiise React, TypeScript et les web sockets</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 20, marginBottom: 20 }}>
        <NotificationButton />
        <BatteryStatus />
      </div>

      <div className="map-container">
        <h2>Ma localisation :</h2>
        <MapLocation width="100%" height={400} zoom={14} />
      </div>

      <VibrationButton />
    </div>
  );
}
