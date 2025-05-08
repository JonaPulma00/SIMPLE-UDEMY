import { errorHandler } from "../middlewares/errorHandler.js";
export const registerStreamHandlers = (io, socket) => {
  socket.on(
    "start-stream",
    errorHandler((groupId) => {
      socket.to(groupId).emit("stream-started", socket.id);
      console.log(`Instructor started stream in room ${groupId}`);
    })
  );
  socket.on(
    "end-stream",
    errorHandler((courseId) => {
      socket.to(courseId).emit("stream-ended");
      console.log(`Instructor ended stream in room ${courseId}`);
    })
  );

  socket.on(
    "watcher",
    errorHandler((courseId) => {
      socket.join(courseId.toString());
      socket.to(courseId).emit("watcher", socket.id);
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
