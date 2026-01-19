"use client";

import { useParams } from "next/navigation";

export default function ChatPage() {
  const { roomName } = useParams<{ roomName: string }>();

  return (
    <div className="chat-container">
      <h1>Room : {decodeURIComponent(roomName)}</h1>
    </div>
  );
}
