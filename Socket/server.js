import { authMiddleware } from "./middlewares/authMiddleware.js";
import { registerGeneralHandlers } from "./handlers/generalHandlers.js";
import { registerStreamHandlers } from "./handlers/streamHandlers.js";
import { registerMessagesHandlers } from "./handlers/messagesHandler.js";
import { createSocketServer } from "./config/socket.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3500;
const FRONT_URL = process.env.APP_URL;

const io = createSocketServer({ port: PORT, origin: FRONT_URL });

const onConnection = (socket) => {
  registerGeneralHandlers(io, socket);
  registerStreamHandlers(io, socket);
  registerMessagesHandlers(io, socket);
};
if (!io) {
  console.error("Could not start socket server");
  process.exit(1);
}
io.use(authMiddleware);
io.on("connection", onConnection);
console.log("Socket server started at port:", PORT);
