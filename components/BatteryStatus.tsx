"use client";

import { useEffect, useState } from "react";

// Étendre Navigator pour TypeScript
declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }

  interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
    onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
    onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
  }
}

export default function BatteryStatus() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    let battery: BatteryManager | null = null;

    const updateBattery = () => {
      if (battery) setBatteryLevel(Math.floor(battery.level * 100));
    };

    if (navigator.getBattery) {
      navigator.getBattery().then((bat) => {
        battery = bat;
        updateBattery();
        battery.addEventListener("levelchange", updateBattery);
      });
    } else {
      console.warn("API Battery non supportée par ce navigateur.");
    }

    return () => {
      if (battery) battery.removeEventListener("levelchange", updateBattery);
    };
  }, []);

  if (batteryLevel === null) return <p>🔋 Batterie non disponible</p>;

  return <p>🔋 Batterie : {batteryLevel}%</p>;
}
