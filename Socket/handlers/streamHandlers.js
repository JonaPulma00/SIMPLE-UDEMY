export const registerStreamHandlers = (io, socket) => {
  socket.on("start-stream", (groupId) => {
    socket.to(groupId).emit("stream-started", socket.id);
    console.log(`Instructor started stream in room ${groupId}`);
  });

  socket.on("watcher", (courseId) => {
    socket.join(courseId.toString());
    socket.to(courseId).emit("watcher", socket.id);
  });

  socket.on("offer", ({ to, offer }) => {
    socket.to(to).emit("offer", { offer, from: socket.id });
  });

  socket.on("answer", ({ to, answer }) => {
    socket.to(to).emit("answer", { answer, from: socket.id });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    socket.to(to).emit("ice-candidate", { candidate, from: socket.id });
  });

  socket.on("draw", (groupId, drawingData) => {
    socket.to(groupId).emit("draw-update", drawingData);
    console.log(`Drawing data received for room ${groupId}`);
  });
};
