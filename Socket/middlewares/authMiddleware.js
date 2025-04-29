import jwt from "jsonwebtoken";

export const authMiddleware = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log("No token provided");
    return next(new Error("Token required"));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  socket.user = decoded;
  next();
};
