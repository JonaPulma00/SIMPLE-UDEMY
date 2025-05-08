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

export const socketService = {
  connectSocket() {
    if (!socket.connected) {
      socket.connect();
    }
  },

  reconnectSocket() {
    if (socket.connected) socket.disconnect();
    socket.connect();
  },

  joinRoom(roomId, userId) {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("join-room", roomId, userId);
    socket.on("user-connected", (id) => {
      console.log("User connected", id);
    });
  },

  leaveRoom(roomId) {
    socket.emit("leave-room", roomId);
  },

  startStream(roomId) {
    socket.emit("start-stream", roomId);
  },
  onStreamStarted(callback) {
    socket.on("stream-started", callback);
  },

  endStream(roomId) {
    socket.emit("end-stream", roomId);
  },

  onStreamEnded(callback) {
    socket.on("stream-ended", callback);
  },
  sendDrawing(roomId, drawingData) {
    socket.emit("draw", roomId, drawingData);
  },

  startWatcher(courseId) {
    socket.emit("watcher", courseId);
  },

  sendOffer(to, offer) {
    socket.emit("offer", { to, offer });
  },

  onOffer(callback) {
    socket.on("offer", ({ offer, from }) => {
      callback({ offer, from });
    });
  },

  sendAnswer(to, answer) {
    socket.emit("answer", { to, answer });
  },

  onAnswer(callback) {
    socket.on("answer", ({ answer, from }) => {
      callback({ answer, from });
    });
  },

  sendIceCandidate(to, candidate) {
    socket.emit("ice-candidate", { to, candidate });
  },

  onIceCandidate(callback) {
    socket.on("ice-candidate", ({ candidate, from }) => {
      callback({ candidate, from });
    });
  },

  onDrawingUpdate(callback) {
    socket.on("draw-update", callback);
  },

  offDrawingUpdate() {
    socket.off("draw-update");
  },

  disconnectSocket() {
    socket.disconnect();
  },
};
