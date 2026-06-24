import express from "express";
import proxy from "express-http-proxy";
import { checkAccessToken, checkRole } from "../middleware/auth.middleware.js";
import createServiceProxy from "../lib/proxyFactory.js";

const router = express.Router();
const INTERACTION_SERVICE_URL = process.env.INTERACTION_SERVICE_URL;

const chatServiceProxy = createServiceProxy(INTERACTION_SERVICE_URL);

// CHAT ROUTES
// Routes cho conversations
router.get("/conversations", chatServiceProxy);
router.post("/conversations", chatServiceProxy);
router.get("/conversations/:conversationId", chatServiceProxy);
router.put("/conversations/:conversationId/read", chatServiceProxy);

// Routes cho messages
router.get("/conversations/:conversationId/messages", chatServiceProxy);

// Routes cho unread count
router.get("/unread-count", chatServiceProxy);

// Admin routes
router.get("/admin/users-with-conversations", chatServiceProxy);

export default router;
