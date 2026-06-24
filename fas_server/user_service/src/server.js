import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 8001;

async function startServer() {
  try {
    await connectDB();
    console.log(" Database connected");
    app.listen(PORT, () => {
      console.log(` User service running on port ${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
  }
}

startServer();
