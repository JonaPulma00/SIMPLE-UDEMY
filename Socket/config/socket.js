import { Server } from "socket.io";

export const createSocketServer = (serverOptions) => {
  const io = new Server({
    cors: {
      origin: serverOptions.origin,
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"],
    },
    transports: ["websocket", "polling"],
  });

  return io;
};
