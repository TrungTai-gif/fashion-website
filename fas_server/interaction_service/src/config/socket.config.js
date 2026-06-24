import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Lưu mapping giữa user và room
const userRooms = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Khi người dùng join vào phòng chat riêng
  socket.on("join_room", ({ userId }) => {
    const roomId = `room_${userId}`;
    socket.join(roomId);
    userRooms.set(socket.id, roomId);
    console.log(`User ${userId} joined ${roomId}`);
  });

  // Khi có tin nhắn gửi đi
  socket.on("send_message", ({ userId, message, sender }) => {
    const roomId = `room_${userId}`;
    io.to(roomId).emit("receive_message", { sender, message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    userRooms.delete(socket.id);
  });
});

server.listen(5000, () => console.log("Chat server running on port 5000"));
