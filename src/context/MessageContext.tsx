import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, getUserMessages, sendMessage, listenToUserMessages } from '../firebase/services/messageService';
import { useAuth } from './AuthContext';

interface MessageContextType {
  messages: Message[];
  unreadCount: number;
  sendNewMessage: (receiverId: string, content: string, orderId?: string) => Promise<Message>;
  markAsRead: (messageId: string) => void;
  loading: boolean;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();
  const { isAuthenticated, userData } = authState;

  // Lấy tin nhắn khi người dùng đăng nhập
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchMessages = async () => {
      if (isAuthenticated && userData?.uid) {
        setLoading(true);
        try {
          // Lắng nghe tin nhắn mới
          unsubscribe = listenToUserMessages(userData.uid, (newMessages) => {
            setMessages(newMessages);
            // Đếm số tin nhắn chưa đọc
            const unread = newMessages.filter(
              msg => !msg.isRead && msg.receiverId === userData.uid
            ).length;
            setUnreadCount(unread);
            setLoading(false);
          });
        } catch (error) {
          console.error('Lỗi khi tải tin nhắn:', error);
          setLoading(false);
        }
      } else {
        setMessages([]);
        setUnreadCount(0);
        setLoading(false);
      }
    };

    fetchMessages();

    // Hủy đăng ký khi component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isAuthenticated, userData?.uid]);

  // Gửi tin nhắn mới
  const sendNewMessage = async (receiverId: string, content: string, orderId?: string): Promise<Message> => {
    if (!isAuthenticated || !userData) {
      throw new Error('Bạn cần đăng nhập để gửi tin nhắn');
    }

    try {
      const messageData: Omit<Message, 'id'> = {
        senderId: userData.uid,
        receiverId,
        content,
        timestamp: new Date().toISOString(),
        isRead: false,
        senderRole: userData.role,
        orderId
      };

      const sentMessage = await sendMessage(messageData);
      return sentMessage;
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      throw error;
    }
  };

  // Đánh dấu tin nhắn đã đọc
  const markAsRead = (messageId: string) => {
    // Cập nhật local state trước
    setMessages(currentMessages => 
      currentMessages.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
    
    // Cập nhật số tin nhắn chưa đọc
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Cập nhật trong database (không cần chờ kết quả)
    try {
      fetch(`/api/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Lỗi khi đánh dấu tin nhắn đã đọc:', error);
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        unreadCount,
        sendNewMessage,
        markAsRead,
        loading
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}; 