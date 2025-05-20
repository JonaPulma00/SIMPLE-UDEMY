import { errorHandler } from "../middlewares/errorHandler.js";

export const registerMessagesHandlers = (io, socket) => {
  socket.on(
    "send-message",
    errorHandler((data) => {
      const { roomId, message, id, username } = data;

      if (!roomId || !message || !id || !username) return;
      if (!message || typeof message !== "string") return;
      const trimmedMessage = message.trim();

      if (!trimmedMessage || trimmedMessage.length > 200) return;
      console.log(`Message received in room ${roomId}: ${trimmedMessage}`);
      socket.to(roomId.toString()).emit("receive-message", {
        id,
        text: message,
        username,
      });
    })
  );
};
