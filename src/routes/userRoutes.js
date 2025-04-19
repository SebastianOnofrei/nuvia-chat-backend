import { Router } from "express";
import { expressjwt } from "express-jwt";
import multer from "multer";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import fs from "fs";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/userController.js";

// asta o sa il mut in controller :)
import User from "../models/userModel.js";

const router = Router();
// ✅ Multer setup
const upload = multer({ dest: "uploads/" });

// ✅ Set up cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get the friends list for the logged-in user
router.get(
  "/friends",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  async (req, res) => {
    try {
      const userId = req.auth.id;

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

router.post(
  "/update-avatar",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), // 🔐 protect it
  upload.single("image"), // 📸 enable file upload
  async (req, res) => {
    const userId = req.auth.id; // Logged-in user's ID (from JWT)
    const filePath = req.file.path;
    console.log("SUNT IN UPDATE USER AVATAR?");
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "nuvia_chat/profile_pics/", // Specify folder for organizing assets
      });

      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete local file:", err);
      });

      // Update user document
      const user = await User.findByIdAndUpdate(
        userId,
        { profilePicture: result.secure_url },
        { new: true }
      );

      const payload = {
        id: user._id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        profilePicture: user.profilePicture,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      res.status(200).json({
        message: "Profile picture updated successfully!",
        token: token,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res
        .status(500)
        .json({ error: "Server error while updating profile picture" });
    }
  }
);

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
