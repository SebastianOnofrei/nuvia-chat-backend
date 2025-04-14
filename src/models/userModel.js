import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the user schema
// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: [true, "Username is required"],
//       unique: true,
//       minlength: [3, "Username must be at least 3 characters long"],
//       maxlength: [50, "Username must be less than 50 characters"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters long"],
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     // Automatically create `createdAt` and `updatedAt` fields
//     timestamps: true,
//   }
// );

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    friends: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ], // Friends list
  },
  { timestamps: true }
);

// Hash the password before saving the user document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Don't hash if the password hasn't been modified
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare a given password with the stored hashed password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Compare password
};

// Create the User model using the schema
const User = mongoose.model("User", userSchema);

export default User;
