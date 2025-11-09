import { io } from "socket.io-client";

// Initialize socket connection
const socket = io("http://localhost:4000", {
  autoConnect: false, // Don't connect automatically
  transports: ['websocket', 'polling'] // Enable both transports
});

export default socket;
