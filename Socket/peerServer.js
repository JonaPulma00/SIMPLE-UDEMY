import express from "express";
import http from "http";
import { ExpressPeerServer } from "peer";
import dotenv from "dotenv";

dotenv.config();

const PEER_PORT = process.env.PEER_PORT || 9000;
const FRONT_URL = process.env.APP_URL;

const app = express();
const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/",
});

app.use("/", peerServer);

peerServer.on("connection", (client) => {
  console.log("Peer connected:", client.id);
});

server.listen(PEER_PORT, () => {
  console.log(`Peer server running on port ${PEER_PORT}`);
});
