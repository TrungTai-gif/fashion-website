import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // gồm user và admin
      },
    ],
    type: {
      type: String,
      enum: ["private", "group"], // 1-1 hoặc nhóm
      default: "private",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);
