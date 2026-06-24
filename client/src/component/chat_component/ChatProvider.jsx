import { useState, useEffect, useContext } from "react";
import Chat from "./ChatClient.jsx";
import { chatService } from "../../services/chatService.js";
import { FaRegMessage } from "react-icons/fa6";
import { useAuth } from "../../store/authStore.js";
import { useSocket } from "../../hooks/useSocket.js";
import { ShopContext } from "../../context/ShopContext.jsx";
import { useQuery } from "@tanstack/react-query";

const ChatProvider = () => {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { unRead, setUnRead } = useContext(ShopContext);

  const { socket } = useSocket(user, "user");

  // React Query: chỉ fetch unreadCount 1 lần khi component mount
  const { data } = useQuery({
    queryKey: ["unreadCount", user?.id],
    queryFn: () => chatService.getUnreadCount(user.id),
    enabled: !!user?.id,
    // staleTime: Infinity, // giữ cache lâu để không fetch lại
  });

  // Khi query load xong, set unRead trong context
  useEffect(() => {
    if (data?.data?.unreadCount !== undefined) {
      setUnRead(data.data.unreadCount);
    }
  }, [data, setUnRead]);

  // Lắng nghe socket để cập nhật realtime
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message.receiverId === user.id) {
        setUnRead((prev) => prev + 1);
      }
    };

    socket.on("receive_message", handleNewMessage);

    return () => {
      socket.off("receive_message", handleNewMessage);
    };
  }, [socket, user.id, setUnRead]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);

    // if (!isChatOpen) {
    setUnRead(0); // reset unread khi mở chat
    // }
  };

  if (!user) return null;

  return (
    <>
      {isChatOpen && <Chat onToggle={toggleChat} />}

      <div
        onClick={toggleChat}
        className="relative p-2 text-white transition-colors duration-200 rounded-full cursor-pointer hover:bg-white/20"
      >
        <FaRegMessage className="text-xl transition-transform duration-200 md:text-2xl hover:scale-110" />

        {unRead > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 text-center bg-indigo-600 leading-5 text-white text-xs font-semibold rounded-full flex items-center justify-center min-w-[20px]">
            {unRead > 99 ? "99+" : unRead}
          </span>
        )}
      </div>
    </>
  );
};

export default ChatProvider;
