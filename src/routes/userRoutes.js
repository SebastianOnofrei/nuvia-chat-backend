import { Router } from "express";
import {
  createUser,
  deleteUser,
  readUser,
  updateUser,
} from "../controllers/userController.js";

const router = Router();

// Fetch a specific user by ID
router.get("/users/:id", readUser);

// Create a new user
router.post("/users", createUser);

// Update a user by ID
router.put("/users/:id", updateUser);

// Delete a user by ID
router.delete("/users/:id", deleteUser);

export { router };
