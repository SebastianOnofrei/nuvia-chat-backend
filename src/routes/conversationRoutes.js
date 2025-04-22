import { Router } from "express";
import { expressjwt } from "express-jwt";
import {
  getConversation,
  getConversationHistory,
} from "../controllers/conversationController.js";

const router = Router();

router.get(
  "/:senderId/:receiverId",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  getConversation
);

router.get(
  "/history",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  getConversationHistory
);

export { router };
