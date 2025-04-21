import { getConversationId } from "../services/messageService.js";

const getConversation = async (req, res) => {
  try {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    const conversation = await getConversationId(senderId, receiverId);

    if (conversation) {
      return res.status(200).json(conversation);
    } else {
      return res.status(404).json({ message: "No conversation found" });
    }
  } catch (error) {
    console.error("Error in getLastMessage:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getConversation };
