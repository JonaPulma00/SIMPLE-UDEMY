import { errorHandler } from "../middlewares/errorHandler.js";

export const registerMessagesHandlers = (io, socket) => {
  socket.on(
    "send-message",
    errorHandler((data) => {
      const { roomId, message, id, username } = data;

      if (!roomId || !message || !id || !username) return;
      console.log(`Message received in room ${roomId}: ${message}`);
      socket.to(roomId.toString()).emit("receive-message", {
        id,
        text: message,
        username,
      });
    })
  );
};
