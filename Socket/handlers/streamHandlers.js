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
    errorHandler((courseId) => {
      activeStreams.add(courseId);
      socket.to(courseId.toString()).emit("stream-started", courseId);
      io.emit("stream-started", courseId);
      console.log(`Instructor started stream in room ${courseId}`);
    })
  );

  socket.on(
    "end-stream",
    errorHandler((courseId) => {
      socket.to(courseId).emit("stream-ended");
      console.log(`Instructor ended stream in room ${courseId}`);
      activeStreams.delete(courseId);
      io.emit("stream-ended", courseId);
    })
  );

  socket.on(
    "watcher",
    errorHandler((courseId) => {
      socket.join(courseId.toString());
      socket.to(courseId.toString()).emit("watcher", socket.id);
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
