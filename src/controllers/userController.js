import User from "../models/userModel.js";

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Optional: Pre-check to give a nicer error message
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    // 💥 Duplicate key error handling
    if (err.code === 11000) {
      const duplicatedField = Object.keys(err.keyPattern)[0]; // e.g., "username" or "email"
      return res.status(409).json({
        error: `${
          duplicatedField.charAt(0).toUpperCase() + duplicatedField.slice(1)
        } already in use.`,
      });
    }

    // 🧯 Other unexpected errors
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

const readUser = (req, res) => {
  const { id } = req.params; // Assuming you're fetching by user ID
  // Fetch the user from DB using `id`
  res.status(200).json({ id, name: "John Doe", email: "john@example.com" });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  // Update user logic in DB
  res.status(200).json({ message: "User updated successfully" });
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.deleteOne(); // OR await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete user", details: err.message });
  }
};

export { createUser, readUser, updateUser, deleteUser };
