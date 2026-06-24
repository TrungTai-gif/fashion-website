// models/authToken.model.js
import mongoose from "mongoose";

const authTokenSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["refresh", "forgot_password"],
      default: "refresh",
    },
    expires_at: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    collection: "auth_tokens",
    timestamps: true,
  }
);

const AuthToken = mongoose.model("AuthToken", authTokenSchema);

export default AuthToken;
