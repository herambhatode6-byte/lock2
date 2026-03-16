import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true, // Ensures no two users can have the same username
      trim: true,   // Removes extra spaces before saving (e.g., " john " -> "john")
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
  }
);

// This is crucial for Next.js to prevent the "OverwriteModelError" during hot reloads.
// It checks if the model already exists in the cache before compiling a new one.
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;