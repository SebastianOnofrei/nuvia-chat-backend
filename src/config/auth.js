import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Email not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const payload = {
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({ token });
  } catch (e) {
    console.error(e);
    response.status(401).json(e.message);
  }
});

export { router };
