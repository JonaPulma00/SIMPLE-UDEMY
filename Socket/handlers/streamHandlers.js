export const registerStreamHandlers = (io, socket) => {
  socket.on("start-stream", (groupId) => {
    io.to(groupId).emit("stream-started", socket.id);
    console.log(`Instructor started stream in room ${groupId}`);
  });

  socket.on("draw", (groupId, drawingData) => {
    io.to(groupId).emit("draw-update", drawingData);
    console.log(`Drawing data received for room ${groupId}`);
  });
};
