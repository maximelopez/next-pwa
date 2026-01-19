"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function ChatPage() {
  const { roomName } = useParams<{ roomName: string }>();

  return (
    <div className="chat-container">
      <h1>Room : {decodeURIComponent(roomName)}</h1>
    </div>
  );
}
