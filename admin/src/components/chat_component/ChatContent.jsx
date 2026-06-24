import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/store/authStore";
import { useChat } from "@/store/chatStore";
import { MessageCircle, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ChatContent = () => {
  const { selectedChat, selectedUser, isConnected, messages } = useChat();
  const { startTyping, stopTyping, sendMessage } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Handle typing indicators
    if (selectedUser) {
      const otherParticipant = selectedUser._id;

      if (otherParticipant) {
        startTyping({
          conversationId: selectedChat._id,
          receiverId: otherParticipant,
        });

        // Clear previous timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
          stopTyping({
            conversationId: selectedChat._id,
            receiverId: otherParticipant,
          });
        }, 1000);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !isConnected) return;

    const otherParticipant = selectedUser._id;

    const messageData = {
      conversationId: selectedChat._id,
      receiverId: otherParticipant,
      content: newMessage.trim(),
      messageType: "text",
    };

    sendMessage(messageData);
    setNewMessage("");

    // Stop typing
    if (otherParticipant) {
      stopTyping({
        conversationId: selectedChat._id,
        receiverId: otherParticipant,
      });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full  w-full">
      {selectedChat ? (
        <>
          {/* Header */}
          <div className="p-2 px-5 bg-white border-b border-gray-200 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full shadow-lg">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedUser.name}
                </h3>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-100  h-120 px-10 py-4 space-y-4 overflow-y-auto  bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageCircle
                    size={48}
                    className="mx-auto mb-4 text-gray-400"
                  />
                  <p>Chưa có tin nhắn nào</p>
                  <p className="mt-2 text-sm text-gray-400">
                    Tin nhắn sẽ xuất hiện ở đây
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.sender === user.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-xs lg:max-w-md shadow-sm ${
                      msg.sender === user.id
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p
                      className={`mt-2 text-xs ${
                        msg.sender === user.id
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
            {/* <div ref={messagesEndRef} /> */}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 shrink-0">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tin nhắn của bạn..."
                className="flex-1 px-4 py-2 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isConnected}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="flex items-center gap-2 px-6 py-2 text-white transition-all bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                <span className="hidden sm:inline">Gửi</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center h-full justify-center">
          <div className="text-center text-gray-500">
            <MessageCircle size={64} className="mx-auto mb-6 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-700">
              Chọn cuộc trò chuyện
            </h3>
            <p className="text-gray-500">
              Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContent;
