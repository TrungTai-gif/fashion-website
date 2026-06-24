// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import notificationRoute from "./routes/notification.route.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/notifications", notificationRoute);

// --- Routes ---
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Notification service is running",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
