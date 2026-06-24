import React, { useState, useEffect } from "react";
import { MessageCircle, Users, Clock } from "lucide-react";
import { chatService } from "../../services/chatService";
import { useSocket } from "../../hooks/useSocket";

const ChatStats = ({ adminUser }) => {
  const [stats, setStats] = useState({
    totalConversations: 0,
    unreadCount: 0,
    onlineUsers: 0,
  });

  const { onlineUsers } = useSocket(adminUser, "admin");

  useEffect(() => {
    if (adminUser?.id) {
      loadStats();
    }
  }, [adminUser]);

  useEffect(() => {
    setStats((prev) => ({ ...prev, onlineUsers: onlineUsers.length }));
  }, [onlineUsers]);

  const loadStats = async () => {
    try {
      const [conversationsRes, unreadRes] = await Promise.all([
        chatService.getConversations(adminUser.id),
        chatService.getUnreadCount(adminUser.id),
      ]);

      setStats((prev) => ({
        ...prev,
        totalConversations: conversationsRes.success
          ? conversationsRes.data.length
          : 0,
        unreadCount: unreadRes.success ? unreadRes.data.unreadCount : 0,
      }));
    } catch (error) {
      console.error("Error loading chat stats:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageCircle size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Tổng cuộc trò chuyện</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalConversations}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Clock size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Tin nhắn chưa đọc</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.unreadCount}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Người dùng online</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.onlineUsers}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatStats;
