import { errorHandler } from "../middlewares/errorHandler.js";

export const registerMessagesHandlers = (io, socket) => {
  socket.on(
    "send-message",
    errorHandler((data) => {
      const { groupId, message, id, username } = data;

      if (!groupId || !message || !id || !username) return;
      console.log(`Message received in group ${data.groupId}: ${data.message}`);
      socket.to(groupId).emit("receive-message", {
        id,
        text: message,
        username,
      });
    })
  );

  
};
