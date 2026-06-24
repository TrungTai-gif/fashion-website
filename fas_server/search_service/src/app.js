// src/app.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import searchRoutes from "./routes/search.route.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

dotenv.config();
const app = express();

// --- Middlewares ---
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route (health check)
app.get("/", (req, res) => {
  res.json({ service: "search_service", status: "ok" });
});

// API routes
app.use("/api/search", searchRoutes);

// Error handler
app.use(errorHandler);

export default app;
