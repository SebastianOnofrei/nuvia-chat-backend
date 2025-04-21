import { Router } from "express";
import { expressjwt } from "express-jwt";
import { getConversation } from "../controllers/conversationController.js";

const router = Router();

router.get(
  "/:senderId/:receiverId",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  getConversation
);

export { router };
