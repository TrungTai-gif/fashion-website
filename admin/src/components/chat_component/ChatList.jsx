import React, { useState, useEffect } from "react";
import { chatService } from "../../services/chatService.js";
import { MessageCircle, Clock, User } from "lucide-react";

const ChatList = ({ userId, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await chatService.getConversations(userId);
      if (response.success) {
        setConversations(response.data);
      }
    } catch (err) {
      console.error("Error loading conversations:", err);
      setError("Không thể tải danh sách cuộc trò chuyện");
    } finally {
      setIsLoading(false);
    }
  };

  const formatLastMessageTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.abs(now - messageTime) / 36e5;

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else {
      return messageTime.toLocaleDateString("vi-VN");
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find((p) => p._id !== userId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải cuộc trò chuyện...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <MessageCircle size={48} className="mb-4" />
        <p>Chưa có cuộc trò chuyện nào</p>
        <p className="text-sm">Bắt đầu chat với admin để được hỗ trợ</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherParticipant = getOtherParticipant(conversation);
        const lastMessage = conversation.lastMessage;

        return (
          <div
            key={conversation._id}
            onClick={() =>
              onSelectConversation && onSelectConversation(conversation)
            }
            className="p-4 transition-colors border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full">
                {otherParticipant?.avatar ? (
                  <img
                    src={otherParticipant.avatar}
                    alt={otherParticipant.username}
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <User size={20} className="text-gray-600" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">
                    {otherParticipant?.username || "Unknown User"}
                  </h3>
                  {lastMessage && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      {formatLastMessageTime(lastMessage.createdAt)}
                    </div>
                  )}
                </div>

                {/* Last message */}
                {lastMessage ? (
                  <p className="mt-1 text-sm text-gray-600 truncate">
                    {lastMessage.sender._id === userId ? "Bạn: " : ""}
                    {lastMessage.content}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-gray-400">
                    Chưa có tin nhắn nào
                  </p>
                )}

                {/* Role badge */}
                {otherParticipant?.role === "admin" && (
                  <span className="inline-block px-2 py-1 mt-2 text-xs text-green-600 bg-green-100 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
