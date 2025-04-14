import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import { expressjwt } from "express-jwt";

const router = Router();

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
