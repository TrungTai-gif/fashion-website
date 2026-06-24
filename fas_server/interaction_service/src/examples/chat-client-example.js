// Example usage của Socket.IO Chat Client
// Cài đặt: npm install socket.io-client

import { io } from "socket.io-client";

class ChatClient {
  constructor(serverUrl = "http://localhost:8008") {
    this.socket = io(serverUrl, {
      transports: ["websocket", "polling"],
    });
    this.userId = null;
    this.userType = null;

    this.setupEventListeners();
  }

  // Join chat room
  join(userId, userType = "user") {
    this.userId = userId;
    this.userType = userType;

    this.socket.emit("join", {
      userId: userId,
      userType: userType,
    });
  }

  // Gửi tin nhắn
  sendMessage(
    receiverId,
    content,
    conversationId = null,
    messageType = "text"
  ) {
    this.socket.emit("send_message", {
      conversationId,
      receiverId,
      content,
      messageType,
    });
  }

  // Đánh dấu tin nhắn đã đọc
  markAsRead(conversationId, messageId = null) {
    this.socket.emit("mark_as_read", {
      conversationId,
      messageId,
    });
  }

  // Bắt đầu typing
  startTyping(conversationId, receiverId) {
    this.socket.emit("typing_start", {
      conversationId,
      receiverId,
    });
  }

  // Kết thúc typing
  stopTyping(conversationId, receiverId) {
    this.socket.emit("typing_stop", {
      conversationId,
      receiverId,
    });
  }

  // Lấy danh sách user online (chỉ admin)
  getOnlineUsers() {
    if (this.userType === "admin") {
      this.socket.emit("get_online_users");
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Nhận tin nhắn mới
    this.socket.on("receive_message", (message) => {
      console.log("New message received:", message);
      this.onMessageReceived(message);
    });

    // Xác nhận tin nhắn đã gửi
    this.socket.on("message_sent", (message) => {
      console.log("Message sent successfully:", message);
      this.onMessageSent(message);
    });

    // Tin nhắn đã được đọc
    this.socket.on("message_read", (data) => {
      console.log("Message read:", data);
      this.onMessageRead(data);
    });

    // User đang typing
    this.socket.on("user_typing", (data) => {
      console.log("User typing:", data);
      this.onUserTyping(data);
    });

    // Danh sách user online (admin)
    this.socket.on("online_users", (users) => {
      console.log("Online users:", users);
      this.onOnlineUsersUpdate(users);
    });

    // User online/offline status
    this.socket.on("user_online", (data) => {
      console.log("User status changed:", data);
      this.onUserStatusChanged(data);
    });

    // Tin nhắn mới từ user (cho admin)
    this.socket.on("new_user_message", (message) => {
      console.log("New message from user:", message);
      this.onNewUserMessage(message);
    });

    // Error handling
    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
      this.onError(error);
    });

    // Connection events
    this.socket.on("connect", () => {
      console.log("Connected to chat server");
      this.onConnected();
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
      this.onDisconnected();
    });
  }

  // Override these methods in your implementation
  onMessageReceived(message) {
    // Handle received message
  }

  onMessageSent(message) {
    // Handle message sent confirmation
  }

  onMessageRead(data) {
    // Handle message read status
  }

  onUserTyping(data) {
    // Handle typing indicator
  }

  onOnlineUsersUpdate(users) {
    // Handle online users list update
  }

  onUserStatusChanged(data) {
    // Handle user online/offline status
  }

  onNewUserMessage(message) {
    // Handle new message notification (for admin)
  }

  onError(error) {
    // Handle errors
  }

  onConnected() {
    // Handle connection established
  }

  onDisconnected() {
    // Handle disconnection
  }

  // Disconnect
  disconnect() {
    this.socket.disconnect();
  }
}

// Example usage:

// For User
const userChat = new ChatClient("http://localhost:8008");
userChat.join("user123", "user");

userChat.onMessageReceived = (message) => {
  console.log("Received:", message.content);
  // Update UI with new message
};

userChat.sendMessage("admin456", "Hello, I need help!");

// For Admin
const adminChat = new ChatClient("http://localhost:8008");
adminChat.join("admin456", "admin");

adminChat.onNewUserMessage = (message) => {
  console.log("New message from user:", message.fromUser);
  // Update admin dashboard
};

adminChat.getOnlineUsers();

export default ChatClient;
