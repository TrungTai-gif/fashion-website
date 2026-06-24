import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

const chatSocket = (io) => {
  // Map để lưu user online và socket ID
  const userSocketMap = new Map();

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User join room
    socket.on("join", async (data) => {
      try {
        const { userId, userType } = data; // userType: 'user' hoặc 'admin'

        // Lưu thông tin user và socket
        userSocketMap.set(userId, {
          socketId: socket.id,
          userType,
          userId,
        });

        socket.userId = userId;
        socket.userType = userType;

        // Join user vào room riêng của họ
        socket.join(`user_${userId}`);

        // Nếu là admin, join vào admin room
        if (userType === "admin") {
          socket.join("admin_room");
        }

        console.log(`${userType} ${userId} joined with socket ${socket.id}`);

        // Emit danh sách user online cho admin
        if (userType === "admin") {
          const onlineUsers = Array.from(userSocketMap.values()).filter(
            (user) => user.userType === "user"
          );
          socket.emit("online_users", onlineUsers);
        }

        // Notify admin về user online
        socket.to("admin_room").emit("user_online", {
          userId,
          userType,
          status: "online",
        });
      } catch (error) {
        console.error("Error in join:", error);
        socket.emit("error", { message: "Failed to join" });
      }
    });

    // Send message
    socket.on("send_message", async (data) => {
      try {
        const {
          conversationId,
          receiverId,
          content,
          messageType = "text",
        } = data;
        const senderId = socket.userId;

        if (!senderId) {
          socket.emit("error", { message: "Please join first" });
          return;
        }

        let conversation;

        // Nếu có conversationId, tìm conversation
        if (conversationId) {
          conversation = await Conversation.findById(conversationId);
        } else {
          // Tìm hoặc tạo conversation giữa sender và receiver
          conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
            type: "private",
          });

          if (!conversation) {
            conversation = new Conversation({
              participants: [senderId, receiverId],
              type: "private",
            });
            await conversation.save();
          }
        }

        // Tạo message mới
        const newMessage = new Message({
          conversation: conversation._id,
          sender: senderId,
          receiver: receiverId,
          content,
          messageType,
          isRead: false,
        });

        await newMessage.save();

        // Cập nhật lastMessage trong conversation
        conversation.lastMessage = newMessage._id;
        await conversation.save();

        const messageData = {
          _id: newMessage._id,
          conversation: conversation._id,
          sender: senderId, // Chỉ gửi ObjectId
          receiver: receiverId,
          content: newMessage.content,
          messageType: newMessage.messageType,
          isRead: newMessage.isRead,
          createdAt: newMessage.createdAt,
        };

        // Gửi message cho người nhận
        socket.to(`user_${receiverId}`).emit("receive_message", messageData);

        // Gửi lại cho người gửi để confirm
        socket.emit("message_sent", messageData);

        // Nếu người gửi là user, gửi cho admin room
        if (socket.userType === "user") {
          socket.to("admin_room").emit("new_user_message", {
            ...messageData,
            fromUser: senderId,
          });
        }

        console.log(`Message sent from ${senderId} to ${receiverId}`);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Mark message as read
    socket.on("mark_as_read", async (data) => {
      try {
        const { messageId, conversationId } = data;
        const userId = socket.userId;

        if (messageId) {
          await Message.findByIdAndUpdate(messageId, { isRead: true });
        } else if (conversationId) {
          // Mark all messages in conversation as read
          await Message.updateMany(
            {
              conversation: conversationId,
              receiver: userId,
              isRead: false,
            },
            { isRead: true }
          );
        }

        // Notify sender that message was read
        const messages = await Message.find({
          conversation: conversationId,
          receiver: userId,
        });

        const senderIds = [
          ...new Set(messages.map((msg) => msg.sender.toString())),
        ];

        senderIds.forEach((senderId) => {
          socket.to(`user_${senderId}`).emit("message_read", {
            conversationId,
            readBy: userId,
          });
        });
      } catch (error) {
        console.error("Error marking as read:", error);
        socket.emit("error", { message: "Failed to mark as read" });
      }
    });

    // Get online status
    socket.on("get_online_users", () => {
      if (socket.userType === "admin") {
        const onlineUsers = Array.from(userSocketMap.values()).filter(
          (user) => user.userType === "user"
        );
        socket.emit("online_users", onlineUsers);
      }
    });

    // Typing indicators
    socket.on("typing_start", (data) => {
      const { conversationId, receiverId } = data;
      socket.to(`user_${receiverId}`).emit("user_typing", {
        userId: socket.userId,
        conversationId,
        isTyping: true,
      });
    });

    socket.on("typing_stop", (data) => {
      const { conversationId, receiverId } = data;
      socket.to(`user_${receiverId}`).emit("user_typing", {
        userId: socket.userId,
        conversationId,
        isTyping: false,
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      if (socket.userId) {
        // Remove from userSocketMap
        userSocketMap.delete(socket.userId);

        // Notify admin về user offline
        socket.to("admin_room").emit("user_online", {
          userId: socket.userId,
          userType: socket.userType,
          status: "offline",
        });

        console.log(`${socket.userType} ${socket.userId} disconnected`);
      }
    });

    // Error handling
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });
};

export default chatSocket;
