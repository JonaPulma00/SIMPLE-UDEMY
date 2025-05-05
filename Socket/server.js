import { authMiddleware } from "./middlewares/authMiddleware.js";
import { registerGeneralHandlers } from "./handlers/generalHandlers.js";
import { registerStreamHandlers } from "./handlers/streamHandlers.js";
import dotenv from "dotenv";
import { createSocketServer } from "./config/socket.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const PEER_PORT = process.env.PEER_PORT || 4500;
const FRONT_URL = process.env.APP_URL;

console.log("Starting socket server with config:", {
  PORT,
  FRONT_URL,
});

const io = createSocketServer({ port: PORT, origin: FRONT_URL });

if (io) {
  console.log("Server started at port:", PORT);

  io.use(authMiddleware);

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    registerGeneralHandlers(io, socket);
    registerStreamHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
} else {
  console.log("Could not start server");
}
