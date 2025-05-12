import { errorHandler } from "../middlewares/errorHandler.js";

const activeStreams = new Set();

export const registerStreamHandlers = (io, socket) => {
  socket.on(
    "get-active-streams",
    errorHandler(() => {
      socket.emit("active-streams", Array.from(activeStreams));
    })
  );

  socket.on(
    "start-stream",
    errorHandler((roomId) => {
      activeStreams.add(roomId);
      socket.join(roomId.toString());
      io.to(roomId.toString()).emit("stream-started", roomId);
      console.log(`Instructor started stream in room ${courseId}`);
    })
  );

  socket.on(
    "end-stream",
    errorHandler((roomId) => {
      io.to(roomId.toString()).emit("stream-ended", roomId);
      activeStreams.delete(roomId);
      console.log(`Instructor ended stream in room ${roomId}`);
    })
  );

  socket.on(
    "join-room",
    errorHandler((roomId, userId) => {
      socket.join(roomId.toString());
      socket.to(roomId.toString()).emit("user-connected", userId);
      console.log(`User ${userId} joined room ${roomId}`);
    })
  );

  socket.on(
    "leave-room",
    errorHandler((roomId) => {
      socket.leave(roomId.toString());
      console.log(`User left room ${roomId}`);
    })
  );

  socket.on(
    "watcher",
    errorHandler((roomId, userId) => {
      socket.join(roomId.toString());
      socket.to(roomId.toString()).emit("watcher", userId);
      console.log(`Watcher ${userId} joined stream${roomId}`);
    })
  );

  socket.on(
    "offer",
    errorHandler(({ to, offer }) => {
      socket.to(to).emit("offer", { offer, from: socket.id });
    })
  );

  socket.on(
    "answer",
    errorHandler(({ to, answer }) => {
      socket.to(to).emit("answer", { answer, from: socket.id });
    })
  );

  socket.on(
    "ice-candidate",
    errorHandler(({ to, candidate }) => {
      socket.to(to).emit("ice-candidate", { candidate, from: socket.id });
    })
  );

  socket.on(
    "draw",
    errorHandler((groupId, drawingData) => {
      socket.to(groupId).emit("draw-update", drawingData);
    })
  );
};
