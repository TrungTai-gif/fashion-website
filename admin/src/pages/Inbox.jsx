import React, { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, User, Circle, Clock } from "lucide-react";
import { useSocket } from "../hooks/useSocket";
import { chatService } from "../services/chatService";
import { useAuth } from "../store/authStore";
import ChatSidebar from "@/components/chat_component/ChatSidebar";
import { ChatContent } from "@/components/chat_component";

const Inbox = () => {
  const { user } = useAuth();

  const { socket } = useSocket(user, "admin");

  return (
    <div className="flex mb-50 max-h-150 min-h-0 w-full bg-white shadow-lg rounded-xl">
      {/* Sidebar chiếm 1/3, content chiếm 2/3 */}
      <div className="flex flex-col h-full min-h-0 w-1/3 border-r border-gray-200 bg-gray-50">
        <ChatSidebar />
      </div>
      <div className="flex  h-full min-h-0 flex-1">
        <ChatContent />
      </div>
    </div>
  );
};

export default Inbox;
