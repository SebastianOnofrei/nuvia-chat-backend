import { Router } from "express";
import { expressjwt } from "express-jwt";
import {
  sendMessage,
  getLastMessage,
} from "../controllers/messageController.js";

const router = Router();

// Define the route to send a message
router.post(
  "/send-message",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  sendMessage
); // POST method for sending messages

// Define the route to get the last message in a conversation
router.get(
  "/last-message/:conversationId",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  getLastMessage
); // GET method for fetching the last message

export { router };
