// src/server.js
import app from "./app.js";
import { ensureIndex, esClientInfo } from "./config/es.js";
import { startProductConsumer } from "./messaging/consumer.js";

const PORT = Number(process.env.PORT);

async function startServer() {
  try {
    console.log("=== STARTING SEARCH SERVICE ===");

    await ensureIndex();
    await esClientInfo();
    // Start RabbitMQ consumer (non-blocking)
    startProductConsumer().catch((err) => {
      console.error("Failed to start RabbitMQ consumer:", err?.message || err);
    });

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Search service running on port ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
      }
    });

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
