import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useChat } from "../store/chatStore";

const SOCKET_URL = "http://localhost:8006";

export const useSocket = (user, userType = "user") => {
  const {
    socket,
    setSocket,
    setIsConnected,
    setOnlineUsers,
    setIsTyping,
    addMessage,
    updateConversation,
  } = useChat();

  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Nếu socket đã tồn tại thì không tạo thêm
    if (socketRef.current) return;

    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    //socket eevnt
    socketInstance.on("connect", () => {
      setIsConnected(true);

      socketInstance.emit("join", {
        userId: user.id,
        userType,
      });
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("connect_error", () => {
      setIsConnected(false);
    });

    socketInstance.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    socketInstance.on("receive_message", (message) => {
      addMessage(message);
      updateConversation(message.conversation, {
        lastMessage: message,
        updatedAt: new Date(),
      });
    });

    socketInstance.on("message_sent", (message) => {
      addMessage(message);
    });

    socketInstance.on("user_typing", (data) => {
      setIsTyping(data.isTyping);
    });

    // Cleanup
    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
      socketRef.current = null;
    };
  }, [user?.id]);

  // SOCKET EMIT FUNCTIONS

  const sendMessage = (data) => {
    const s = useChat.getState().socket;
    if (s) s.emit("send_message", data);
  };

  const markAsRead = (data) => {
    const s = useChat.getState().socket;
    if (s) s.emit("mark_as_read", data);
  };

  const startTyping = (data) => {
    const s = useChat.getState().socket;
    if (s) s.emit("typing_start", data);
  };

  const stopTyping = (data) => {
    const s = useChat.getState().socket;
    if (s) s.emit("typing_stop", data);
  };

  return {
    socket: useChat.getState().socket,
    isConnected: useChat.getState().isConnected,
    onlineUsers: useChat.getState().onlineUsers,

    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
  };
};
