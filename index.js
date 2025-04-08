const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
  },
});

// Use CORS middleware to allow all origins :)
// #TODO: When deploying frontend to a dedicated URL, add just that URL in the allowed list

// Store connected users' socket IDs
let users = {}; // { userId: socketId }

app.use(cors());

// SocketIO server..
let connectedUsers = 0;

io.on("connection", (socket) => {
  // Increment the counter when a user connects
  connectedUsers++;
  console.log(`A user connected. Total connected users: ${connectedUsers}`);

  socket.emit("welcome", "Hello, welcome to the server!");

  // When a user sends their ID (e.g., username), store the socket ID
  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID: ${socket.id}`);
  });

  // Handle private message
  socket.on("private_message", (data) => {
    const { senderId, recipientId, message } = data;

    // Send the message to the recipient if they are online (socket ID is stored)
    const recipientSocketId = users[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("private_message", {
        senderId,
        message,
      });
      console.log(
        `Private message from ${senderId} to ${recipientId}: ${message}`
      );
    } else {
      console.log(`User ${recipientId} is not connected.`);
    }
  });

  socket.on("disconnect", () => {
    connectedUsers--;
    console.log(
      `A user disconnected. Total connected users: ${connectedUsers}`
    );

    // Remove the user from the list of connected users
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
