import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// Lấy danh sách conversation của user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const conversations = await Conversation.find({
      participants: userId,
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Lấy messages trong một conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Đảo ngược để tin nhắn cũ nhất ở trên
    messages.reverse();

    const total = await Message.countDocuments({
      conversation: conversationId,
    });

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          hasNext: skip + messages.length < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Tạo conversation mới giữa user và admin
export const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!userId || !participantId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Participant ID are required",
      });
    }

    // Kiểm tra conversation đã tồn tại chưa
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
      type: "private",
    });

    if (conversation) {
      return res.json({
        success: true,
        data: conversation,
        message: "Conversation already exists",
      });
    }

    // Tạo conversation mới
    conversation = new Conversation({
      participants: [userId, participantId],
      type: "private",
    });

    await conversation.save();

    res.status(201).json({
      success: true,
      data: conversation,
      message: "Conversation created successfully",
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Lấy thông tin conversation
export const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Error getting conversation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Đánh dấu tin nhắn đã đọc
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: userId,
        isRead: false,
      },
      { isRead: true }
    );

    res.json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Lấy số tin nhắn chưa đọc
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const unreadCount = await Message.countDocuments({
      receiver: userId,
      isRead: false,
    });

    res.json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Admin: Lấy danh sách user có conversation
export const getUsersWithConversations = async (req, res) => {
  try {
    const adminId = req.user?.id || req.query.adminId;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required",
      });
    }

    const conversations = await Conversation.find({
      participants: adminId,
    }).sort({ updatedAt: -1 });

    // Trả về conversations với ObjectId, không populate
    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Error getting users with conversations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
