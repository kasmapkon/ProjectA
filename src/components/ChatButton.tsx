import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';
import { Message } from '../firebase/services/messageService';
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useOrder } from '../context/OrderContext';

// Dịch vụ lấy thông tin admin
const getAdminInfo = async () => {
  // Trong thực tế, có thể lấy thông tin admin từ API hoặc Firebase
  return {
    id: 'admin123',
    name: 'Admin Shop',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  };
};

const ChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [admin, setAdmin] = useState<{ id: string; name: string; avatar: string } | null>(null);
  const { messages, unreadCount, sendNewMessage, loading } = useMessages();
  const { authState } = useAuth();
  const { isAuthenticated, userData } = authState;
  const { newOrderId } = useOrder();
  const [showOrderInfo, setShowOrderInfo] = useState(!!newOrderId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Lấy thông tin admin
  useEffect(() => {
    const fetchAdminInfo = async () => {
      const adminInfo = await getAdminInfo();
      setAdmin(adminInfo);
    };
    
    fetchAdminInfo();
  }, []);
  
  // Tự động scroll xuống khi có tin nhắn mới
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  // Nếu có đơn hàng mới, tự động mở cửa sổ chat
  useEffect(() => {
    if (newOrderId) {
      setIsOpen(true);
      setShowOrderInfo(true);
    }
  }, [newOrderId]);
  
  // Chỉ hiển thị tin nhắn giữa người dùng hiện tại và admin
  const filteredMessages = messages.filter(msg => 
    admin && (
      (msg.senderId === userData?.uid && msg.receiverId === admin.id) || 
      (msg.receiverId === userData?.uid && msg.senderId === admin.id)
    )
  );
  
  // Gửi tin nhắn
  const handleSendMessage = async () => {
    if (!message.trim() || !admin || !isAuthenticated) return;
    
    try {
      // Gửi tin nhắn đến admin
      await sendNewMessage(
        admin.id, 
        message, 
        newOrderId // Đính kèm mã đơn hàng nếu có
      );
      
      // Xóa tin nhắn trong ô input
      setMessage('');
      
      // Ẩn thông tin đơn hàng sau khi đã gửi
      if (showOrderInfo) {
        setShowOrderInfo(false);
      }
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  };
  
  // Format thời gian tin nhắn
  const formatMessageTime = (timestamp: string) => {
    try {
      return formatDistance(new Date(timestamp), new Date(), {
        addSuffix: true,
        locale: vi // Sử dụng locale tiếng Việt
      });
    } catch (error) {
      return '';
    }
  };
  
  // Nhóm tin nhắn theo người gửi
  const groupMessages = (messages: Message[]) => {
    const grouped: Message[][] = [];
    let currentGroup: Message[] = [];
    let currentSender = '';
    
    messages.forEach(msg => {
      if (currentSender !== msg.senderId) {
        if (currentGroup.length > 0) {
          grouped.push([...currentGroup]);
        }
        currentGroup = [msg];
        currentSender = msg.senderId;
      } else {
        currentGroup.push(msg);
      }
    });
    
    if (currentGroup.length > 0) {
      grouped.push(currentGroup);
    }
    
    return grouped;
  };
  
  const groupedMessages = groupMessages(filteredMessages);
  
  return (
    <>
      {/* Biểu tượng Chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-gradient-to-r from-violet-600 to-purple-600'
        }`}
      >
        {isOpen ? (
          <X size={24} color="white" />
        ) : (
          <div className="relative">
            <MessageCircle size={24} color="white" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        )}
      </button>
      
      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200 transition-all animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageCircle size={18} />
                <span>Chat với hỗ trợ viên</span>
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Thông báo khi không đăng nhập */}
          {!isAuthenticated && (
            <div className="p-4 text-center text-gray-600 bg-gray-50">
              <p>Vui lòng đăng nhập để chat với nhân viên hỗ trợ</p>
            </div>
          )}
          
          {/* Thông tin đơn hàng mới */}
          {isAuthenticated && showOrderInfo && newOrderId && (
            <div className="p-4 bg-violet-50 border-b border-violet-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-violet-800">
                  Thông tin đơn hàng mới
                </h4>
                <button 
                  onClick={() => setShowOrderInfo(!showOrderInfo)}
                  className="text-violet-600 hover:text-violet-800 p-1 rounded-full"
                >
                  {showOrderInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              <div className="p-3 bg-white rounded-lg border border-violet-100 mt-1">
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Mã đơn hàng:</span> {newOrderId}
                </p>
                <p className="text-xs text-gray-500">
                  Bạn có thể sử dụng mã này để theo dõi đơn hàng của mình.
                </p>
              </div>
            </div>
          )}
          
          {/* Lịch sử tin nhắn */}
          {isAuthenticated && (
            <div className="flex-1 overflow-y-auto p-4 max-h-80 bg-gray-50">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader size={24} className="text-violet-500 animate-spin" />
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-6">
                  <MessageCircle size={32} className="text-gray-300 mb-2" />
                  <p className="text-sm">Chưa có tin nhắn nào</p>
                  <p className="text-xs mt-1">Hãy gửi tin nhắn để được hỗ trợ</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {groupedMessages.map((group, groupIndex) => {
                    const isUserMessage = group[0].senderId === userData?.uid;
                    return (
                      <div 
                        key={groupIndex} 
                        className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] ${isUserMessage ? 'order-1' : 'order-2'}`}>
                          {/* Avatar */}
                          {!isUserMessage && (
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center">
                                <User size={12} className="text-violet-600" />
                              </div>
                              <span className="text-xs font-medium text-gray-700">
                                {admin?.name || 'Admin'}
                              </span>
                            </div>
                          )}
                          
                          {/* Tin nhắn */}
                          <div className="space-y-1">
                            {group.map((msg, msgIndex) => (
                              <div
                                key={msg.id || msgIndex}
                                className={`p-3 rounded-lg text-sm ${
                                  isUserMessage
                                    ? 'bg-violet-600 text-white rounded-tr-none'
                                    : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                                }`}
                              >
                                {msg.content}
                                <div className={`text-xs mt-1 ${isUserMessage ? 'text-violet-200' : 'text-gray-400'}`}>
                                  {formatMessageTime(msg.timestamp)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          )}
          
          {/* Ô nhập tin nhắn */}
          {isAuthenticated && (
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`p-2 rounded-full ${
                    message.trim()
                      ? 'bg-violet-600 text-white hover:bg-violet-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatButton; 