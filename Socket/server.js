import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 4000;
const FRONT_URL = process.env.APP_URL;
const io = new Server(PORT, {
  cors: {
    origin: [FRONT_URL],
  },
});
if (io) {
  console.log("Server started at port:", PORT);
} else {
  console.error("Unable to start the server");
}
io.on("connection", (socket) => {
  socket.on("join-room", (groupId) => {
    socket.join(groupId.toString());
    console.log(`User ${socket.id} joined room ${groupId}`);
  });

  socket.on("leave-room", (groupId) => {
    socket.leave(groupId.toString());
    console.log(`User ${socket.id} left room ${groupId}`);
  });

  socket.on("start-stream", (groupId) => {
    io.to(groupId).emit("stream-started", socket.id);
    console.log(`Instructor started stream in room ${groupId}`);
  });

  socket.on("draw", (groupId, drawingData) => {
    io.to(groupId).emit("draw-update", drawingData);
  });
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
