// /socket/socketHandler.js
let connectedUsers = 0;
let users = {}; // { userId: socketId }

const handleSocket = (io) => {
  io.on("connection", (socket) => {
    connectedUsers++;
    console.log(`A user connected. Total connected users: ${connectedUsers}`);

    socket.emit("welcome", "Hello, welcome to the server!");

    socket.on("register", (userId) => {
      users[userId] = socket.id;
      console.log(`User ${userId} registered with socket ID: ${socket.id}`);
    });

    socket.on("private_message", (data) => {
      const { senderId, recipientId, message } = data;
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

      // Remove the user from connected users list
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};

export default handleSocket;
