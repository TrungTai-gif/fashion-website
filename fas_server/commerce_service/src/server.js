import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT;

async function startServer() {
  try {
    console.log("=== STARTING COMMERCE SERVICE ===");

    await connectDB();

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Commerce service running on port ${PORT}`);
    });

    // Handle server errors
    server.on("error", (error) => {
      console.error("✗ Server error:", error);
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
      }
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
