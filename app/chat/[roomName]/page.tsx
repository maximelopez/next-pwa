"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function ChatPage() {
  const { roomName } = useParams<{ roomName: string }>();
  const searchParams = useSearchParams();
  const pseudo = searchParams.get("pseudo") || "Anon";

  const [messages, setMessages] = useState<{ pseudo: string; content: string }[]>([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  // 🔌 Connexion au socket
  useEffect(() => {
    const s = io("https://api.tools.gavago.fr", {
      path: "/socket.io",
      transports: ["websocket"],
    });

    setSocket(s);

    // Rejoindre la room automatiquement
    s.on("connect", () => {
      console.log("✅ Connecté au serveur :", s.id);
      s.emit("chat-join-room", { roomName, pseudo }); // <-- pseudo envoyé ici aussi
    });

    return () => {
      s.emit("chat-leave-room", { roomName });
      s.disconnect();
    };
  }, [roomName, pseudo]);

  // 🔥 Réception des messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg: { pseudo: string; content: string }) => {
      console.log("Message reçu du serveur :", msg);
      setMessages(prev => [...prev, msg]);
    };

    socket.on("chat-message", handleMessage);

    return () => {
      socket.off("chat-message", handleMessage);
    };
  }, [socket]);

  // ✉️ Envoi d'un message
  const sendMessage = () => {
    if (!socket || !message) return;
    
    socket.emit("chat-message", {
      roomName,
      pseudo,      // <-- pseudo envoyé avec chaque message
      content: message,
    });

    setMessage("");
  };

  return (
    <div className="chat-container">
      <h1>Room : {decodeURIComponent(roomName)}</h1>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className="chat-message">
            <strong>{msg.pseudo} :</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Votre message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>Envoyer</button>
      </div>
    </div>
  );
}
