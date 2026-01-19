"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

interface RoomData {
  roomName: string;
  clients: Record<string, { pseudo: string; initiator: boolean }>;
}

const BASE_URL = "https://api.tools.gavago.fr";

export default function Room() {
  const [rooms, setRooms] = useState<Record<string, RoomData>>({});
  const [search, setSearch] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState("Non connecté");
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetch(BASE_URL + "/socketio/api/rooms")
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

  // 🔹 Connexion socket
  const connectSocket = () => {
    console.log("Connexion à :", BASE_URL);
    const s = io(BASE_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: false,
    });

    // ⚠️ Si un ancien socket existait, on le ferme
    if (socket) {
      socket.disconnect();
    }

    setSocket(s);
    setStatus("Connexion en cours...");

    s.on("connect", () => {
      console.log("✅ Connecté ! ID :", s.id);
      setConnected(true);
      setStatus("✅ Connecté");
    });

    // ⚡ On écoute UNE SEULE FOIS cet événement
    s.on("chat-joined-room", (data) => {
      console.log("🎉 Rejoint la room avec succès :", data);
      setCurrentRoom(data.roomName);
    });

    s.on("disconnect", () => {
      console.log("🔌 Déconnecté du serveur");
      setConnected(false);
      setStatus("Déconnecté");
    });
  };


  // 🔹 Fonction séparée pour rejoindre une room
  const joinRoom = (roomName: string) => {
    if (!socket) {
      console.warn("⚠️ Socket non initialisé !");
      return;
    }

    if (currentRoom && currentRoom !== roomName) {
      console.log(`🚪 Quitte la room "${currentRoom}"`);
      socket.emit("chat-leave-room", { roomName: currentRoom });
    }

    console.log(`➡️ Tentative de rejoindre la room "${roomName}"`);
    socket.emit("chat-join-room", { pseudo, roomName });
    
    // Naviguer vers la room
    router.push(`/chat/${encodeURIComponent(roomName)}`);
  };

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
          onClick={() => {
            connectSocket();
          }}
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
            <div 
              className="room-item" 
              key={key}
              onClick={() => joinRoom(safeDecode(room))}
            >
              {safeDecode(room)}
            </div>
        ))}
         <p className="room-status">💬 Room actuelle : {currentRoom}</p>
        <p className="socket-status">{status}</p>
      </div>
    )}
    </div>
  );
}
