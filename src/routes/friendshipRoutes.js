import express from "express";
import User from "../models/userModel.js";
import { expressjwt } from "express-jwt";

const router = express.Router();

// Add a friend
router.post(
  "/add",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  async (req, res) => {
    try {
      const { friendEmail } = req.body; // The user to add as a friend
      const userId = req.auth.id; // Logged-in user's ID (from JWT)

      // TODO: Add verification on Frontend to not add the same Email as your user Email :)

      // Find the current user and the friend
      const user = await User.findById(userId);
      const friend = await User.findOne({ email: friendEmail });

      if (!friend) {
        return res.status(404).json({ error: "Friend not found" });
      }

      // Add the friend to the user's friends list
      if (!user.friends.includes(friend.id)) {
        user.friends.push(friend.id);
        await user.save();
      }

      // We also add the user to the friend's list as well (mutual friendship)
      if (!friend.friends.includes(userId)) {
        friend.friends.push(userId);
        await friend.save();
      }

      res.status(200).json({ message: "Friend added successfully!" });
    } catch (error) {
      console.error("Error adding friend:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export { router };
