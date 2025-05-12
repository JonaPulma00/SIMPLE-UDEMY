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
      socket.auth = { token: getToken() };
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
    console.log(`Joining room ${roomId} as ${userId}`);
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
    socket.on("stream-started", (courseId) => {
      callback(courseId);
    });
  },

  offStreamStarted() {
    socket.off("stream-started");
  },

  endStream(roomId) {
    socket.emit("end-stream", roomId);
  },

  onStreamEnded(callback) {
    socket.on("stream-ended", (courseId) => {
      callback(courseId);
    });
  },

  offStreamEnded() {
    socket.off("stream-ended");
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
      console.log("Received answer from:", from);
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

  getActiveStreams(callback) {
    socket.emit("get-active-streams");
    socket.once("active-streams", (streams) => {
      callback(streams);
    });
  },

  onWatcher(callback) {
    socket.on("watcher", (watcherId) => {
      callback(watcherId);
    });
  },

  offWatcher() {
    socket.off("watcher");
  },

  disconnectSocket() {
    socket.disconnect();
  },
};
