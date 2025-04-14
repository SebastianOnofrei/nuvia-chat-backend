import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import { expressjwt } from "express-jwt";

const router = Router();

// Get the friends list for the logged-in user
router.get(
  "/friends",
  // expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  async (req, res) => {
    try {
      const userId = req.user.id;

      console.log("================== USER ID IN FRIENDS");
      console.log(userId);

      const user = await User.findById(userId).populate(
        "friends",
        "username email _id"
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user.friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Fetch a specific user by ID
router.get(
  "/:id",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  getUser
);

// Create a new user
router.post("/", createUser);

// Update a user by ID
router.put(
  "/:id",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  updateUser
);

// Delete a user by ID
router.delete(
  "/:id",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  deleteUser
);

export { router };
