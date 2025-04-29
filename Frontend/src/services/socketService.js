import { io } from "socket.io-client";
import { getToken } from "./tokenService";

export const socket = io(import.meta.env.VITE_SOCKET_SERVER_URL, {
  auth: {
    token: getToken(),
  },
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};
export const reconnectSocket = () => {
  if (socket.connected) socket.disconnect();
  socket.connect();
};

export const joinRoom = (roomId) => {
  socket.emit("join-room", roomId);
};

export const leaveRoom = (roomId) => {
  socket.emit("leave-room", roomId);
};

export const startStream = (roomId) => {
  socket.emit("start-stream", roomId);
};

export const disconnectSocket = () => {
  socket.disconnect();
};
