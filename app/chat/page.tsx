"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface RoomData {
  roomName: string;
  clients: Record<string, { pseudo: string; initiator: boolean }>;
}

interface ChatMessage {
  content: string;
  dateEmis?: string;
  roomName: string;
  categorie?: string;
  userId?: string;
  serverId?: string;
  pseudo?: string;
}

const BASE_URL = "https://api.tools.gavago.fr";

export default function Room() {
  const [rooms, setRooms] = useState<Record<string, RoomData>>({});
  const [search, setSearch] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState("Non connecté");
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  // 🔹 Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");

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

    if (socket) s.disconnect();
    setSocket(s);
    setStatus("Connexion en cours...");

    s.on("connect", () => {
      console.log("✅ Connecté ! ID :", s.id);
      setConnected(true);
      setStatus("✅ Connecté");
    });

    // 🔹 Écoute des messages du serveur
    s.on("chat-msg", (msg: ChatMessage & { pseudo?: string }) => {
      setMessages((prev) => [...prev, msg]);
    });

    // 🔹 Quand on rejoint une room
    s.on("chat-joined-room", (data: { roomName: string }) => {
      console.log("🎉 Rejoint la room :", data.roomName);
      setCurrentRoom(prev => prev ?? data.roomName);
    });

    s.on("disconnect", () => {
      console.log("🔌 Déconnecté du serveur");
      setConnected(false);
      setStatus("Déconnecté");
    });

    // 🔹 Écoute des erreurs
    s.on("error", (msg: string) => {
      alert(`Erreur du serveur: ${msg}`);
    });
  };

  // 🔹 Rejoindre une room
  const joinRoom = (roomName: string) => {
    if (!socket) return;
    if (currentRoom) socket.emit("chat-leave-room", { roomName: currentRoom });
    socket.emit("chat-join-room", { pseudo, roomName });
  };

  // 🔹 Envoyer un message
  const sendMessage = () => {
    if (!socket || !message || !currentRoom) return;

    // 🔹 Envoyer au serveur via chat-msg
    socket.emit("chat-msg", { content: message, roomName: currentRoom, pseudo });

    setMessage("");
  };

  // 🔹 Retour à la liste des rooms
  const leaveRoom = () => {
    if (!socket || !currentRoom) return;
    socket.emit("chat-leave-room", { roomName: currentRoom });
    setCurrentRoom(null);
    setMessages([]);
  };

  return (
    <div className="container">
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
          <button className="login-btn" disabled={!pseudo} onClick={connectSocket}>
            Se connecter
          </button>
        </div>
      ) : !currentRoom ? (
        // 🌐 Liste des rooms
        <div className="list-rooms">
          <div className="header-reception">
            <h1>Liste des rooms</h1>
            <div className="user-info">
              <span className="pseudo">{status} : {pseudo}</span>
            </div>
          </div>

          <input
            type="text"
            placeholder="Rechercher une room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="room-search"
          />

          <div className="room-separator"></div>

          {Object.keys(rooms)
            .filter((room) => safeDecode(room).toLowerCase().includes(search.toLowerCase()))
            .map((room, key) => (
              <div className="room-item" key={key} onClick={() => joinRoom(safeDecode(room))}>
                {safeDecode(room)}
              </div>
            ))}
        </div>
      ) : (
        // 💬 Chat room
        <div className="chat-container">
          <div className="header-reception">
             <button className="login-btn" onClick={leaveRoom}>
              ⬅ Retour
            </button>
            <h1>Room : {currentRoom}</h1>
          </div>

          <div
            className="chat-messages"
            style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "12px" }}
          >
            {messages
            .filter(msg => msg.pseudo && msg.pseudo !== "SERVER")
            .map((msg, i) => (
              <div key={i}  className={`chat-message ${msg.pseudo === pseudo ? "self" : "other"}`}>
                <strong>{msg.pseudo || "Anon"}</strong> {msg.content}
              </div>
            ))}
          </div>

          <div className="chat-input" style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Votre message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
            <button className="login-btn" onClick={sendMessage}>
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
