import jwt from "jsonwebtoken";
import Message from "../models/messageModel.js";

let users = {}; // { userId: socketId }

const handleSocket = (io) => {
  // 🔐 Middleware: JWT validation
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("No token"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      console.log("JWT Error:", err.message);
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    users[userId] = socket.id;
    console.log(users);
    console.log(`✅ ${userId} connected.`);

    socket.emit("welcome", "Welcome to the socket server!");

    // 📨 Handle sending private message
    socket.on(
      "private_message",
      async ({ recipientId, content, conversationId }) => {
        const recipientSocketId = users[recipientId];

        try {
          // 1. Save message to DB, including conversationId
          console.log("📩 Incoming message:", {
            recipientId,
            content,
            conversationId,
          });

          // If conversationId is not provided, create a new one (you can define your own logic here for handling conversations)
          if (!conversationId) {
            console.log(
              "No conversationId provided, generating a new conversation."
            );
            // Handle conversation creation logic here or fetch it based on sender and receiver.
            // If it's a new conversation, create one, else just use the existing conversationId.
          }

          const newMsg = await Message.create({
            senderId: userId,
            receiverId: recipientId,
            content,
            conversationId, // Save the conversationId
          });

          // 2. Send the message to recipient if they are online
          const recipientSocket = users[recipientId];
          if (recipientSocket) {
            io.to(recipientSocket).emit("private_message", {
              senderId: userId,
              content,
              timestamp: newMsg.timestamp,
              conversationId: conversationId, // Include the conversationId in the response
            });
            console.log(`📤 ${userId} → ${recipientId}: ${content}`);
          } else {
            console.log(`📥 Saved for offline user ${recipientId}`);
          }
        } catch (err) {
          console.error("❌ Error sending message:", err.message);
        }
      }
    );

    // 🔌 Handle disconnect
    socket.on("disconnect", () => {
      if (users[userId] === socket.id) {
        delete users[userId];
      }
      console.log(`❌ ${userId} disconnected.`);
    });
  });
};

export default handleSocket;
