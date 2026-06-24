// models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Password is required only for local accounts
    password: {
      type: String,
      required: function () {
        return this.provider === "local" || !this.provider;
      },
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    avatar: { type: String },
    googleId: { type: String, index: true },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
