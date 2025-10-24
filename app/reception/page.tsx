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
  const [pseudo, setPseudo] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [connected, setConnected] = useState(false);

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

      {connected &&
      <div className="header-reception">
        <h1>Liste des rooms</h1>
          <div className="user-info">
          <span className="pseudo">{pseudo}</span>
          {photo && (
            <img
              src={URL.createObjectURL(photo)}
              alt="Photo"
              className="user-photo-preview"
            />
          )}
        </div>
      </div>
      }

      {!connected ? (
      <div className="login-form">
        <h2>Connexion</h2>
        <input
          type="text"
          placeholder="Votre pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          className="login-input"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          className="login-input"
        />

        {photo && (
          <img
            src={URL.createObjectURL(photo)}
            alt="Aperçu"
            className="photo-preview"
          />
        )}

        <button
          className="login-btn"
          disabled={!pseudo}
          onClick={() => setConnected(true)}
        >
          Se connecter
        </button>
      </div>
    ) : (
      <div className="list-rooms">

        
        <input
          type="text"
          placeholder="Rechercher une room..."
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
    )}
    </div>
  );
}
