import api from "./api.js";

const CHAT_API_BASE = "http://localhost:8000/api/chat";

// Tạo axios instance riêng cho chat service
const chatApi = {
  get: (url, config = {}) => api.get(`${CHAT_API_BASE}${url}`, config),
  post: (url, data = {}, config = {}) =>
    api.post(`${CHAT_API_BASE}${url}`, data, config),
  put: (url, data = {}, config = {}) =>
    api.put(`${CHAT_API_BASE}${url}`, data, config),
  delete: (url, config = {}) => api.delete(`${CHAT_API_BASE}${url}`, config),
};

export const chatService = {
  // Lấy danh sách conversations
  getConversations: async (userId) => {
    try {
      const response = await chatApi.get(`/conversations?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting conversations:", error);
      throw error;
    }
  },

  // Tạo conversation mới
  createConversation: async (userId, participantId) => {
    try {
      const response = await chatApi.post("/conversations", {
        userId,
        participantId,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  },

  // Lấy thông tin conversation
  getConversation: async (conversationId) => {
    try {
      const response = await chatApi.get(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting conversation:", error);
      throw error;
    }
  },

  // Lấy messages trong conversation
  getMessages: async (conversationId, page = 1, limit = 50) => {
    try {
      const response = await chatApi.get(
        `/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting messages:", error);
      throw error;
    }
  },

  // Đánh dấu tin nhắn đã đọc
  markAsRead: async (conversationId, userId) => {
    try {
      const response = await chatApi.put(
        `/conversations/${conversationId}/read`,
        {
          userId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error marking as read:", error);
      throw error;
    }
  },

  // Lấy số tin nhắn chưa đọc
  getUnreadCount: async (userId) => {
    try {
      const response = await chatApi.get(`/unread-count?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }
  },
};
