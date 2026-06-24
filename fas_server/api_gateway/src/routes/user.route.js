import express from "express";
import proxy from "express-http-proxy";
import createServiceProxy from "../lib/proxyFactory.js";
import { checkAccessToken, checkRole } from "../middleware/auth.middleware.js";

const router = express.Router();
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

const userServiceProxy = createServiceProxy(USER_SERVICE_URL);

router.post("/register", userServiceProxy);
router.get("/:id", checkAccessToken, userServiceProxy);
router.put("/:id", checkAccessToken, userServiceProxy);

// ADMIN ONLY ROUTES
// GET all users (admin only)
router.get("/", checkAccessToken, checkRole(["admin"]), userServiceProxy);
router.get("/admin", checkAccessToken, userServiceProxy);

// ================= ADDRESS =================
// Add address
router.post("/address", checkAccessToken, userServiceProxy);
// Delete address
router.delete("/address/:id", checkAccessToken, userServiceProxy);
// Set default address
router.patch("/address/:addressId/default", checkAccessToken, userServiceProxy);
// Get address list
router.get("/address/:userId", checkAccessToken, userServiceProxy);

// // Update address
// router.patch("/address/:addressId", checkAccessToken, userServiceProxy);

export default router;
