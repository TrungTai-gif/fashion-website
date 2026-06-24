// routes/user.route.js
import express from "express";
import userController from "../controllers/user.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { updateRoleSchema } from "../schemas/user.schema.js";

const router = express.Router();

export default router;
