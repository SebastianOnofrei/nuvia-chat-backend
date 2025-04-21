import messageService from "../services/messageService.js";

// Controller to send a message
const sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  try {
    const message = await messageService.sendMessage(
      senderId,
      receiverId,
      content
    );

    if (message) {
      return res.status(200).json(message); // Send the sent message as response
    } else {
      return res.status(400).json({ message: "Failed to send message." });
    }
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to get the last message in a conversation
const getLastMessage = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const lastMessage = await messageService.getLastMessageInConversation(
      conversationId
    );

    if (lastMessage) {
      return res.status(200).json(lastMessage);
    } else {
      return res
        .status(404)
        .json({ message: "No messages found in this conversation." });
    }
  } catch (error) {
    console.error("Error in getLastMessage:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { sendMessage, getLastMessage };
