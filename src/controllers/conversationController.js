import {
  getAllMessagesInConversation,
  getConversationId,
} from "../services/messageService.js";

const getConversation = async (req, res) => {
  try {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    const conversation = await getConversationId(senderId, receiverId);

    if (conversation) {
      return res.status(200).json(conversation);
    } else {
      return res.status(200).json({ message: "No conversation found" });
    }
  } catch (error) {
    console.error("Error in getLastMessage:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getConversationHistory = async (req, res) => {
  const conversationId = req.query.conversationId;

  const conversationHistory = await getAllMessagesInConversation(
    conversationId
  );

  if (conversationHistory) {
    return res.status(200).json(conversationHistory);
  } else {
    return res.status(200).json({ message: "No conversation history found" });
  }
};

export { getConversation, getConversationHistory };
