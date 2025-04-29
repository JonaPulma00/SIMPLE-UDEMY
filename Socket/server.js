import { authMiddleware } from "./middlewares/authMiddleware.js";
import { registerGeneralHandlers } from "./handlers/generalHandlers.js";
import { registerStreamHandlers } from "./handlers/streamHandlers.js";
import dotenv from "dotenv";
import { createSocketServer } from "./config/socket.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const FRONT_URL = process.env.APP_URL;
const io = createSocketServer({ port: PORT, origin: FRONT_URL });

io
  ? console.log("Server started at port:", PORT)
  : console.log("Could not start server");
io.use(authMiddleware);

io.on("connection", (socket) => {
  registerGeneralHandlers(io, socket);
  registerStreamHandlers(io, socket);
});
