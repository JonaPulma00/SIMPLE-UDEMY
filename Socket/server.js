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
io.on("connection", (socket) => {
  socket.on("join-room", (groupId) => {
    socket.join(groupId.toString());
    console.log(`User ${socket.id} joined room ${groupId}`);
  });
});
