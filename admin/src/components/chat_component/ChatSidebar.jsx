import { MessageCircle, User, Clock } from "lucide-react";
import { useChat } from "../../store/chatStore";
import { GoDotFill } from "react-icons/go";
import { useAuth } from "@/store/authStore";
import { useEffect, useState } from "react";
import { chatService } from "@/services/chatService";
import UserConversation from "./UserConversation";
import { FaRegCommentDots } from "react-icons/fa";

const ChatSidebar = () => {
  const { isConnected, conversations, setConversations, setUnreadCounts } =
    useChat();

  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user]);

  const [isLoading, setIsLoading] = useState();

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await chatService.getConversations(user.id);
      if (response.success) {
        setConversations(response.data);
        // Load unread counts for each conversation
        const unreadCountsData = {};
        for (const conv of response.data) {
          try {
            const unreadRes = await chatService.getUnreadCount(conv._id);
            if (unreadRes.success) {
              unreadCountsData[conv._id] = unreadRes.data.unreadCount || 0;
            }
          } catch (error) {
            unreadCountsData[conv._id] = 0;
          }
        }
        setUnreadCounts(unreadCountsData);

        // if (!selectedChat && response.data.length > 0) {
        //   setSelectedChat(response.data[0]);
        // }
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-w-64 border-r border-gray-200 bg-gray-100">
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className=" flex items-center gap-2">
            <FaRegCommentDots />
            <h2 className="text-lg font-semibold text-gray-800">Nhắn tin</h2>
          </div>

          <div className="flex items-center space-x-2">
            <GoDotFill
              size={18}
              className={`${
                isConnected ? "text-green-500" : "text-red-500"
              } fill-current`}
            />
            <span className="text-xs text-gray-500">
              {isConnected ? "Đã kết nối" : "Đang kết nối..."}
            </span>
          </div>
        </div>
      </div>
      {isLoading && (
        <>
          <div>Loading ....</div>
        </>
      )}

      {conversations && conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 p-8 text-gray-500">
          <MessageCircle size={48} className="mb-4 text-gray-400" />
          <p className="text-center">Chưa có cuộc trò chuyện nào</p>
          <p className="mt-2 text-sm text-center text-gray-400">
            Cuộc trò chuyện sẽ xuất hiện khi khách hàng gửi tin nhắn
          </p>
        </div>
      ) : (
        <div className="overflow-y-auto">
          {conversations &&
            conversations.map((conv) => (
              <UserConversation key={conv._id} conversation={conv} />
            ))}
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
