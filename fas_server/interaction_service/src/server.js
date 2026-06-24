import app from "./app.js";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import chatSocket from "./sockets/chat.socket.js";

const PORT = process.env.PORT;

async function startServer() {
  try {
    await connectDB();
    console.log("Database connected");

    // Tạo HTTP server
    const server = createServer(app);

    // Tạo Socket.IO server
    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:5174", "http://localhost:5173"], // Client URLs
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    // Setup chat socket handlers
    chatSocket(io);

    server.listen(PORT, () => {
      console.log(`Interaction service running on port ${PORT}`);
      console.log(`Socket.IO server is ready`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();
