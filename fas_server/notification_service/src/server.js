// src/server.js
import app from "./app.js";
// import { connectRabbitMQ } from "./config/rabbitmq.js";
// import { startEventListeners } from "./events/notificationEvents.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT;

async function startServer() {
  try {
    console.log("=== STARTING NOTIFICATION SERVICE ===");

    await connectDB();

    // await connectRabbitMQ();

    // await startEventListeners();

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Notification service running on port ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
      }
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(() => {
        console.log("Process terminated");
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
