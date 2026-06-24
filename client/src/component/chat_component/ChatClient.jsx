import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../hooks/useSocket";
import { chatService } from "../../services/chatService";
import { Send, MessageCircle, X, Minimize2 } from "lucide-react";
import { userService } from "../../services/userService";
import { useChat } from "../../store/chatStore";
import { useAuth } from "../../store/authStore";

const Chat = ({ onToggle }) => {
  const { getAdmin } = userService();

  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { user } = useAuth();

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, markAsRead, startTyping, stopTyping } = useSocket();

  const { socket, isConnected, messages, setMessages, isTyping, setIsTyping } =
    useChat();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat when opened
  useEffect(() => {
    if (user) {
      initializeChat();
    }
  }, [user]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      const adminResponse = await getAdmin();
      if (adminResponse) {
        setAdminUser(adminResponse);

        // Create or get conversation with admin
        const convResponse = await chatService.createConversation(
          user.id,
          adminResponse._id
        );
        if (convResponse.success) {
          setConversation(convResponse.data);
          // Load messages
          const messagesResponse = await chatService.getMessages(
            convResponse.data._id
          );

          if (messagesResponse.success) {
            setMessages(messagesResponse.data.messages);
            markAsRead(convResponse.data._id, user.id);
            await chatService.markAsRead(convResponse.data._id, user.id);
          }
        }
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !adminUser || !isConnected) return;

    const messageData = {
      conversationId: conversation?._id,
      receiverId: adminUser._id,
      content: newMessage.trim(),
      messageType: "text",
    };

    sendMessage(messageData);
    setNewMessage("");

    // Stop typing
    if (adminUser) {
      stopTyping({
        conversationId: conversation._id,
        receiverId: adminUser._id,
      });
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Handle typing indicators
    if (adminUser && conversation) {
      startTyping({
        conversationId: conversation._id,
        receiverId: adminUser._id,
      });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping({
          conversationId: conversation._id,
          receiverId: adminUser._id,
        });
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`fixed top-[15%]  right-[5%] bg-white rounded-lg shadow-xl border border-gray-500 z-51 transition-all duration-300 ${
        isMinimized ? "w-86 h-16" : "w-86 h-105"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white bg-pink-500 rounded-t-lg">
        <div className="relative flex items-center space-x-2">
          <MessageCircle size={20} />

          <div className="font-medium">
            {adminUser ? `Chat với Admin` : "Đang kết nối..."}
            <div
              className={`-top-1 -right-2 absolute w-2 h-2 rounded-full ${isConnected ? "bg-blue-500" : "bg-red-500"}`}
            ></div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded hover:bg-pink-500"
          >
            <Minimize2 size={16} />
          </button>
          <button onClick={onToggle} className="p-1 rounded hover:bg-pink-500">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto h-72">
            {messages && messages.length === 0 ? (
              <div className="text-sm text-center text-gray-500">
                Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.sender === user.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.sender === user.id
                        ? "bg-pink-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === user.id
                          ? "text-green-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="px-3 py-2 text-gray-800 bg-gray-200 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1  focus:border-transparent"
                disabled={!isConnected || !adminUser}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected || !adminUser}
                className="p-2 text-white transition-colors bg-pink-500 rounded-lg hover:bg-pink-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
