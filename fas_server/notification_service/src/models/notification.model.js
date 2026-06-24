import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["password_reset", "email_verification", "order_confirmation"],
      default: "password_reset",
      index: true,
    },

    otp: {
      type: String,
      required: false,
      index: true,
    },

    subject: {
      type: String,
      required: false,
    },

    expiresAt: {
      type: Date,
      required: false,
      index: true,
    },

    sentAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ email: 1, type: 1, createdAt: -1 });
notificationSchema.index({ otp: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
