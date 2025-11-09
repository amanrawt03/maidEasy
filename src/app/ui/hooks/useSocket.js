"use client";

import { useEffect, useState } from "react";
import socket from "@/app/api/config/socketClient";

export const useSocket = ({uName}) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to socket
    socket.connect();

    // Event listeners
    const onConnect = () => {
      console.log(`Connected to socket server as ${uName}`);
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log(`Disconnected from socket server as ${uName}`);
      setIsConnected(false);
    };
    console.log('I REACHED HERE')
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Cleanup function
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);

  return { socket, isConnected };
};
