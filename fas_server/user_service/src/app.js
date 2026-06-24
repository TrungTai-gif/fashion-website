import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import morgan from "morgan";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import addressRoutes from "./routes/address.route.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan("dev"));

// root test
app.get("/", (req, res) => {
  res.json({ service: "user_service", status: "ok" });
});

// health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users/address", addressRoutes);

// global error handler
app.use(errorHandler);

export default app;
