"use client";

import { useEffect, useState } from "react";

interface RoomData {
  roomName: string;
  clients: Record<string, { pseudo: string; initiator: boolean }>;
}

const BASE_URL = "https://api.tools.gavago.fr/socketio/api/";

export default function Room() {
  const [rooms, setRooms] = useState<Record<string, RoomData>>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(BASE_URL + "rooms")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setRooms(data.data);
      })
      .catch((err) => console.error("Erreur API rooms:", err));
  }, []);

  function safeDecode(str: string): string {
    let decoded = str;
    
    while (decoded.includes("%")) {
      const newDecoded = decodeURIComponent(decoded);
      if (newDecoded === decoded) break;
      decoded = newDecoded;
    }   

    return decoded;
  }

  return (
    <div className="container">
      <h1>Liste des rooms</h1>

      <div className="list-rooms">
        <input
          type="text"
          placeholder="Rechercher une room"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="room-search"
        />

        <div className="room-separator"></div>

        {Object.keys(rooms)
          .filter((room) =>
            safeDecode(room).toLowerCase().includes(search.toLowerCase())
          )
          .map((room, key) => (
            <div className="room-item" key={key}>
              {safeDecode(room)}
            </div>
        ))}
      </div>
    </div>
  );
}
