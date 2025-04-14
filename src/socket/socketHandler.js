import jwt from "jsonwebtoken";
import Message from "../models/messageModel.js";

let users = {}; // { userId: socketId }

const handleSocket = (io) => {
  // 🔐 Middleware: JWT validation
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log("======================= HELLOOOOOOOOOOOOO TOKEN");
    console.log(token);
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

    console.log("======================= HELLOOOOOOOOOOOOO userID");
    console.log(userId);
    console.log(users);

    users[userId] = socket.id;

    console.log(`✅ ${userId} connected.`);

    socket.emit("welcome", "Welcome to the socket server!");

    // 📨 Handle sending private message
    socket.on("private_message", async ({ recipientId, content }) => {
      try {
        // 1. Save to DB
        const newMsg = await Message.create({
          sender: userId,
          receiver: recipientId,
          content,
        });

        // 2. Send to recipient if online
        const recipientSocket = users[recipientId];
        if (recipientSocket) {
          io.to(recipientSocket).emit("private_message", {
            senderId: userId,
            content,
            timestamp: newMsg.timestamp,
          });
          console.log(`📤 ${userId} → ${recipientId}: ${content}`);
        } else {
          console.log(`📥 Saved for offline user ${recipientId}`);
        }
      } catch (err) {
        console.error("❌ Error sending message:", err.message);
      }
    });

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
