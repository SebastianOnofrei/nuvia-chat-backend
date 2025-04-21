import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ], // List of participants in the conversation (could be 2 for a one-on-one chat or more for group chats)
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // The last message in the conversation
    createdAt: { type: Date, default: Date.now }, // When the conversation was created
    updatedAt: { type: Date, default: Date.now }, // Last updated (e.g., when a new message is sent)
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt`
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
