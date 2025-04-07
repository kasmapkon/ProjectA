import { ref, push, get, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { db } from '../config';
import { pushData, fetchData, listenToData } from './database';

// Path đến dữ liệu chat trong Firebase
const MESSAGES_PATH = 'messages';

// Interface cho tin nhắn
export interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  orderId?: string; // ID đơn hàng liên quan (nếu có)
  senderRole: 'user' | 'admin';
}

/**
 * Gửi tin nhắn mới
 * @param message Tin nhắn cần gửi
 * @returns Thông tin tin nhắn đã gửi kèm ID
 */
export const sendMessage = async (message: Omit<Message, 'id'>): Promise<Message> => {
  try {
    // Thêm thời gian gửi tin nhắn
    const messageWithTimestamp = {
      ...message,
      timestamp: message.timestamp || new Date().toISOString(),
      isRead: false
    };
    
    // Lưu tin nhắn vào cơ sở dữ liệu
    const result = await pushData(MESSAGES_PATH, messageWithTimestamp);
    
    if (!result.success || !result.id) {
      throw new Error('Không thể gửi tin nhắn');
    }
    
    // Trả về tin nhắn kèm ID
    return {
      ...messageWithTimestamp,
      id: result.id
    };
  } catch (error: any) {
    console.error('Lỗi khi gửi tin nhắn:', error);
    throw new Error(`Không thể gửi tin nhắn: ${error.message}`);
  }
};

/**
 * Lấy tất cả tin nhắn của một người dùng
 * @param userId ID của người dùng
 * @returns Danh sách tin nhắn 
 */
export const getUserMessages = async (userId: string): Promise<Message[]> => {
  try {
    // Lấy tất cả tin nhắn
    const messagesData = await fetchData(MESSAGES_PATH);
    
    if (!messagesData) return [];
    
    // Lọc tin nhắn của người dùng (là người gửi hoặc người nhận)
    const userMessages: Message[] = [];
    Object.entries(messagesData).forEach(([id, data]) => {
      const message = data as Omit<Message, 'id'>;
      if (message.senderId === userId || message.receiverId === userId) {
        userMessages.push({
          id,
          ...message
        });
      }
    });
    
    // Sắp xếp tin nhắn theo thời gian
    return userMessages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  } catch (error) {
    console.error('Lỗi khi lấy tin nhắn của người dùng:', error);
    throw error;
  }
};

/**
 * Lấy tin nhắn giữa hai người dùng
 * @param userId1 ID người dùng thứ nhất
 * @param userId2 ID người dùng thứ hai
 * @returns Danh sách tin nhắn
 */
export const getConversation = async (userId1: string, userId2: string): Promise<Message[]> => {
  try {
    const allMessages = await getUserMessages(userId1);
    
    // Lọc tin nhắn giữa 2 người dùng
    const conversation = allMessages.filter(message => 
      (message.senderId === userId1 && message.receiverId === userId2) ||
      (message.senderId === userId2 && message.receiverId === userId1)
    );
    
    return conversation;
  } catch (error) {
    console.error('Lỗi khi lấy cuộc trò chuyện:', error);
    throw error;
  }
};

/**
 * Lấy tin nhắn liên quan đến một đơn hàng cụ thể
 * @param orderId ID đơn hàng
 * @returns Danh sách tin nhắn liên quan đến đơn hàng
 */
export const getOrderMessages = async (orderId: string): Promise<Message[]> => {
  try {
    // Lấy tất cả tin nhắn
    const messagesData = await fetchData(MESSAGES_PATH);
    
    if (!messagesData) return [];
    
    // Lọc tin nhắn liên quan đến đơn hàng
    const orderMessages: Message[] = [];
    Object.entries(messagesData).forEach(([id, data]) => {
      const message = data as Omit<Message, 'id'>;
      if (message.orderId === orderId) {
        orderMessages.push({
          id,
          ...message
        });
      }
    });
    
    // Sắp xếp tin nhắn theo thời gian
    return orderMessages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  } catch (error) {
    console.error(`Lỗi khi lấy tin nhắn cho đơn hàng ${orderId}:`, error);
    throw error;
  }
};

/**
 * Lắng nghe tin nhắn mới của người dùng
 * @param userId ID người dùng
 * @param callback Hàm xử lý khi có tin nhắn mới
 * @returns Hàm hủy lắng nghe
 */
export const listenToUserMessages = (userId: string, callback: (messages: Message[]) => void) => {
  // Lắng nghe thay đổi từ cơ sở dữ liệu
  return listenToData(MESSAGES_PATH, (messagesData) => {
    if (!messagesData) {
      callback([]);
      return;
    }
    
    // Lọc tin nhắn của người dùng
    const userMessages: Message[] = [];
    Object.entries(messagesData).forEach(([id, data]) => {
      const message = data as Omit<Message, 'id'>;
      if (message.senderId === userId || message.receiverId === userId) {
        userMessages.push({
          id,
          ...message
        });
      }
    });
    
    // Sắp xếp tin nhắn theo thời gian
    callback(userMessages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    ));
  });
};

/**
 * Lắng nghe tin nhắn mới giữa hai người dùng
 * @param userId1 ID người dùng thứ nhất
 * @param userId2 ID người dùng thứ hai
 * @param callback Hàm xử lý khi có tin nhắn mới
 * @returns Hàm hủy lắng nghe
 */
export const listenToConversation = (
  userId1: string, 
  userId2: string, 
  callback: (messages: Message[]) => void
) => {
  // Lắng nghe thay đổi từ cơ sở dữ liệu
  return listenToData(MESSAGES_PATH, (messagesData) => {
    if (!messagesData) {
      callback([]);
      return;
    }
    
    // Lọc tin nhắn giữa 2 người dùng
    const conversation: Message[] = [];
    Object.entries(messagesData).forEach(([id, data]) => {
      const message = data as Omit<Message, 'id'>;
      if ((message.senderId === userId1 && message.receiverId === userId2) ||
          (message.senderId === userId2 && message.receiverId === userId1)) {
        conversation.push({
          id,
          ...message
        });
      }
    });
    
    // Sắp xếp tin nhắn theo thời gian
    callback(conversation.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    ));
  });
};

/**
 * Đánh dấu tin nhắn đã đọc
 * @param messageId ID của tin nhắn
 * @returns Kết quả cập nhật
 */
export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  try {
    const updatePath = `${MESSAGES_PATH}/${messageId}`;
    const result = await pushData(updatePath, { isRead: true });
    return result.success;
  } catch (error) {
    console.error(`Lỗi khi đánh dấu tin nhắn ${messageId} đã đọc:`, error);
    return false;
  }
};

/**
 * Gửi tin nhắn tự động từ admin khi có đơn hàng mới
 * @param userId ID người dùng đặt hàng
 * @param orderId Mã đơn hàng
 * @returns Tin nhắn đã gửi
 */
export const sendOrderNotification = async (userId: string, orderId: string): Promise<Message> => {
  try {
    // Lấy ID của admin từ cấu hình hoặc database
    const adminId = 'admin123'; // ID mặc định của admin
    
    // Nội dung tin nhắn
    const content = `Đơn hàng #${orderId} của bạn đã được tiếp nhận và đang được xử lý. Bạn có thể sử dụng mã này để theo dõi đơn hàng của mình tại trang theo dõi đơn hàng. Cảm ơn bạn đã mua sắm tại VioletShop!`;
    
    // Dữ liệu tin nhắn
    const messageData: Omit<Message, 'id'> = {
      senderId: adminId,
      receiverId: userId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
      orderId,
      senderRole: 'admin'
    };
    
    // Gửi tin nhắn
    const sentMessage = await sendMessage(messageData);
    return sentMessage;
  } catch (error: any) {
    console.error('Lỗi khi gửi thông báo đơn hàng:', error);
    throw new Error(`Không thể gửi thông báo đơn hàng: ${error.message}`);
  }
}; 