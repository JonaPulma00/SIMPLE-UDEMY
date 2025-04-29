import { Server } from "socket.io";

export const createSocketServer = (serverOptions) => {
  return new Server(serverOptions.port, {
    cors: {
      origin: [serverOptions.origin],
      credentials: true,
    },
  });
};
