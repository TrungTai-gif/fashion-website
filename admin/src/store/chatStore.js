import { create } from "zustand";

export const useChat = create((set, get) => ({
  socket: null,
  isConnected: false,
  conversations: [],
  selectedChat: null,
  messages: [],
  isTyping: false,
  unreadCounts: {},
  onlineUsers: [],
  selectedUser: null,

  // socket state
  setSocket: (socket) => set({ socket }),
  setIsConnected: (value) => set({ isConnected: value }),

  // chat states
  setConversations: (conversations) => set({ conversations }),
  setSelectedChat: (selectedChat) => set({ selectedChat }),
  setMessages: (messages) => set({ messages }),
  setIsTyping: (isTyping) => set({ isTyping }),
  setUnreadCounts: (unreadCounts) => set({ unreadCounts }),
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
  // usser selected
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  updateUnreadCount: (conversationId, count) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [conversationId]: count },
    })),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  addConversation: (conversation) =>
    set((state) => ({ conversations: [conversation, ...state.conversations] })),

  updateConversation: (conversationId, data) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === conversationId ? { ...conv, ...data } : conv
      ),
    })),
}));
