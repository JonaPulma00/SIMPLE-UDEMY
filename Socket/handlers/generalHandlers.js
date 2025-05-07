import { errorHandler } from "../middlewares/errorHandler.js";
export const registerGeneralHandlers = (io, socket) => {
  socket.on(
    "join-room",
    errorHandler((roomId, userId) => {
      socket.join(roomId.toString());
      socket.broadcast.to(roomId).emit("user-connected", userId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    })
  );

  socket.on(
    "leave-room",
    errorHandler((roomId) => {
      socket.leave(roomId.toString());
      console.log(`Socket ${socket.id} left room ${roomId}`);
    })
  );

  socket.on(
    "disconnect",
    errorHandler(() => {
      console.log(`Socket disconnected: ${socket.id}`);
    })
  );
};
