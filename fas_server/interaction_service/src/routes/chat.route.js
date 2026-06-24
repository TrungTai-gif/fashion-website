import express from "express";
import {
  getConversations,
  getMessages,
  createConversation,
  getConversation,
  markAsRead,
  getUnreadCount,
  getUsersWithConversations,
} from "../controllers/chat.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { createConversationSchema } from "../schemas/chat.schema.js";

const router = express.Router();

// Routes cho conversations
router.get("/conversations", getConversations);
router.post(
  "/conversations",
  validate(createConversationSchema),
  createConversation
);
router.get(
  "/conversations/:conversationId",

  getConversation
);
router.put("/conversations/:conversationId/read", markAsRead);

// Routes cho messages
router.get("/conversations/:conversationId/messages", getMessages);

// Routes cho unread count
router.get("/unread-count", getUnreadCount);

// Get admin for chat
// router.get("/admin", getAdminForChat);

// Admin routes
router.get("/admin/users-with-conversations", getUsersWithConversations);

export default router;
