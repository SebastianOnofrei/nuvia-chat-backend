import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

// Function to create a new conversation between two users
const createConversation = async (senderId, receiverId) => {
  try {
    const conversation = new Conversation({
      participants: [senderId, receiverId],
    });

    await conversation.save();
    return conversation;
  } catch (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
};

// Create or find a conversation between two users
const getConversationId = async (senderId, receiverId) => {
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("lastMessage", "content timestamp");
    return conversation;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return null;
  }
};

// Function to send a message
const sendUserMessage = async (senderId, receiverId, content) => {
  try {
    // Step 1: Check if a conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    console.log("=================== AVEM CONVERSATION");
    console.log(conversation);

    // Step 2: If no conversation exists, create a new one
    if (!conversation) {
      conversation = await createConversation(senderId, receiverId);
    }

    // Step 3: Create and save the new message
    const message = new Message({
      conversationId: conversation._id,
      sender: senderId,
      receiver: receiverId,
      content: content,
    });

    await message.save();

    // Step 4: Update the conversation with the latest message
    conversation.lastMessage = message._id;
    await conversation.save();

    return message; // Return the sent message
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

// Function to get the last message in a conversation
const getLastMessageInConversation = async (conversationId) => {
  try {
    const lastMessage = await Message.find({ conversationId })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order (most recent first)
      .limit(1); // Only retrieve the most recent message

    return lastMessage[0]; // Return the last message or null if not found
  } catch (error) {
    console.error("Error retrieving last message:", error);
    return null;
  }
};

// Function to fetch all messages in a conversation
const getAllMessagesInConversation = async (conversationId) => {
  try {
    const messages = await Message.find({ conversationId }).sort({
      timestamp: 1,
    }); // Sort by timestamp in ascending order (oldest first)

    return messages;
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return [];
  }
};

export {
  sendUserMessage,
  getLastMessageInConversation,
  getAllMessagesInConversation,
  createConversation,
  getConversationId,
};
