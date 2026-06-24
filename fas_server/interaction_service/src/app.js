import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.middleware.js";
// import { corsMiddleware } from "./middlewares/auth.middleware.js";
import morgan from "morgan";
import chatRoutes from "./routes/chat.route.js";

dotenv.config();
const app = express();

const CLIENT_PORT = process.env.CLIENT_PORT;
const ADMIN_PORT = process.env.ADMIN_PORT;
// CORS configuration
app.use(
  cors({
    // Thêm các origin của client
    origin: [CLIENT_PORT, ADMIN_PORT],
    credentials: true,
  })
);

// app.use(corsMiddleware);
app.use(express.json());
app.use(morgan("dev"));

// root test
app.get("/", (req, res) => {
  res.json({ service: "interaction_service", status: "ok" });
});

// Chat routes
app.use("/api/chat", chatRoutes);

// global error handler
app.use(errorHandler);

export default app;
