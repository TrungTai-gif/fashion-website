// routes/user.route.js
import express from "express";
import userController from "../controllers/user.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchema } from "../schemas/user.schema.js";

const router = express.Router();

router.post("/register", validate(registerSchema), userController.register);

router.get("/admin", userController.getAdmin);

router.get("/:id", userController.getProfile);

router.get("/", userController.getAll);

router.put("/:id", userController.updateProfile);

router.delete("/:id", userController.deleteUser);

export default router;
