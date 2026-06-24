import { useSocket } from "@/hooks/useSocket";
import { userService } from "@/services";
import { chatService } from "@/services/chatService";
import { useAuth } from "@/store/authStore";
import { useChat } from "@/store/chatStore";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import React from "react";

const UserConversation = ({ conversation }) => {
  const { user } = useAuth();

  const {
    onlineUsers,
    unreadCounts,
    selectedChat,
    setSelectedChat,
    setUnreadCounts,
    setSelectedUser,
    setMessages,
  } = useChat();
  const { markAsRead } = useSocket();

  const getOtherParticipantId = (conversation) => {
    return conversation.participants.find((p) => p !== user.id);
  };
  const otherParticipantId = getOtherParticipantId(conversation);
  const isOnline = onlineUsers.some((u) => u.userId === otherParticipantId);
  const unreadCount = unreadCounts[conversation._id] || 0;

  // get user name
  const { getProfile } = userService();
  const { data: customer } = useQuery({
    queryKey: ["customer", { otherParticipantId }],
    queryFn: () => getProfile(otherParticipantId),
  });

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

  const loadMessages = async (conversationId) => {
    try {
      const response = await chatService.getMessages(conversationId);
      if (response.success) {
        setMessages(response.data.messages);
        // Mark messages as read
        markAsRead(conversationId, user.id);
        await chatService.markAsRead(conversationId, user.id);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSelectChat = (conversation) => {
    setSelectedChat(conversation);
    setMessages([]);
    loadMessages(conversation._id);

    // Reset unread count for this conversation
    setUnreadCounts((prev) => ({
      ...prev,
      [conversation._id]: 0,
    }));
  };

  return (
    <>
      <div
        key={conversation._id}
        onClick={() => {
          handleSelectChat(conversation);
          setSelectedUser(customer);
        }}
        className={`p-2 px-4 cursor-pointer transition-all duration-200 border-b border-gray-100 
    hover:bg-blue-50 
    ${
      selectedChat?._id === conversation._id
        ? "bg-blue-100/80 shadow-sm font-semibold"
        : ""
    }`}
      >
        <div className="flex items-start space-x-3">
          <div className="relative">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-full shadow-md">
              <User size={20} className="text-white" />
            </div>
            {isOnline && (
              <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm -bottom-1 -right-1"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {customer ? (
                  <p className="font-semibold text-gray-800 truncate">
                    {customer.name}
                  </p>
                ) : (
                  <p className="font-semibold text-gray-800 truncate">
                    #{otherParticipantId?.slice(-8)}
                  </p>
                )}
              </div>

              {!isOnline && (
                <>
                  {conversation.lastMessage && (
                    <div className="flex items-center text-xs text-gray-500">
                      {formatLastMessageTime(conversation.updatedAt)}
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
            </div>

            {conversation.lastMessage ? (
              <p className="mt-1 text-sm text-gray-800 font-bold truncate">
                {conversation.lastMessage.content}
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-400">Chưa có tin nhắn nào</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserConversation;
