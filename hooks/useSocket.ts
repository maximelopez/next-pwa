import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket(serverUrl: string) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io(serverUrl, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => setIsConnected(true));
    socketRef.current.on("disconnect", () => setIsConnected(false));

    return () => {
      socketRef.current?.disconnect();
    };
  }, [serverUrl]);

  return { socket: socketRef.current, isConnected };
}
