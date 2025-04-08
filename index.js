const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express();

const server = http.createServer(app);
const io = new Server(server);

// Use CORS middleware to allow all origins :)
// #TODO: When deploying frontend to a dedicated URL, add just that URL in the allowed list
app.use(cors());

// SocketIO server..

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.emit("welcome", "Hello, welcome to the server!");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});
