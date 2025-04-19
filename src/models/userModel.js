import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dfqwiwh5r/image/upload/v1745018385/nuvia-chat/profile_pics/man_default.png",
    },
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
