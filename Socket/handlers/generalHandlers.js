export const registerGeneralHandlers = (io, socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId.toString());
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId.toString());
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
};
