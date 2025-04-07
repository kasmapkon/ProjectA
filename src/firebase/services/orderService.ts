import { fetchData, listenToData, pushData, updateData, queryByField } from './database';
import { auth } from '../config';

// Đường dẫn cho dữ liệu đơn hàng
const ORDERS_PATH = 'orders';

// Trạng thái đơn hàng
export enum OrderStatus {
  PENDING = 'pending', // Đơn hàng mới tạo, đang chờ xử lý
  PROCESSING = 'processing', // Đơn hàng đang được xử lý
  SHIPPING = 'shipping', // Đơn hàng đang được giao
  COMPLETED = 'completed', // Đơn hàng đã hoàn thành
  CANCELLED = 'cancelled', // Đơn hàng đã bị hủy
}

// Phương thức thanh toán
export enum PaymentMethod {
  COD = 'COD', // Thanh toán khi nhận hàng
  BANKING = 'banking', // Chuyển khoản ngân hàng
  MOMO = 'momo', // Ví điện tử MoMo
  ZALOPAY = 'zalopay', // Ví điện tử ZaloPay
}

// Interface cho sản phẩm trong đơn hàng
export interface OrderItem {
  id: string;
  code: string;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  quantity: number;
}

// Interface cho đơn hàng
export interface Order {
  id?: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  items: OrderItem[];
  orderDate: string;
  processedDate?: string;
  shippingDate?: string;
  deliveryDate?: string;
  cancelledDate?: string;
  note?: string;
}

/**
 * Tạo đơn hàng mới
 * @param orderData Dữ liệu đơn hàng
 * @returns Đơn hàng đã tạo với ID
 */
export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<Order> => {
  try {
    // Lấy thông tin người dùng hiện tại (nếu đã đăng nhập)
    const currentUser = auth.currentUser;
    const userId = currentUser ? currentUser.uid : orderData.userId;
    
    // Đảm bảo các item có đầy đủ thông tin
    const validatedItems = orderData.items.map(item => ({
      ...item,
      id: item.id || '',
      code: item.code || '',
      imageUrl: item.imageUrl || ''
    }));
    
    // Khởi tạo đơn hàng với thông tin bổ sung
    const newOrder: Omit<Order, 'id'> = {
      ...orderData,
      userId,
      items: validatedItems,
      orderDate: orderData.orderDate || new Date().toISOString(),
      status: orderData.status || OrderStatus.PENDING,
      paymentStatus: orderData.paymentMethod === PaymentMethod.COD ? 'unpaid' : 'paid',
    };
    
    // Lưu đơn hàng vào database và lấy ID
    const result = await pushData(ORDERS_PATH, newOrder);
    
    if (!result.success || !result.id) {
      throw new Error('Không thể tạo đơn hàng');
    }
    
    // Trả về đơn hàng với ID
    return {
      ...newOrder,
      id: result.id,
    };
  } catch (error: any) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    throw new Error(`Không thể tạo đơn hàng: ${error.message}`);
  }
};

/**
 * Lấy tất cả đơn hàng
 * @returns Danh sách tất cả đơn hàng
 */
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const ordersData = await fetchData(ORDERS_PATH);
    
    if (!ordersData) return [];
    
    // Chuyển đổi dữ liệu từ object sang array với id
    return Object.entries(ordersData).map(([id, data]) => ({
      id,
      ...data as Omit<Order, 'id'>
    }));
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    throw error;
  }
};

/**
 * Lắng nghe thay đổi của tất cả đơn hàng
 * @param callback Hàm callback được gọi khi dữ liệu thay đổi
 * @returns Hàm hủy lắng nghe
 */
export const listenToOrders = (callback: (orders: Order[]) => void) => {
  return listenToData(ORDERS_PATH, (ordersData) => {
    if (!ordersData) {
      callback([]);
      return;
    }
    
    // Chuyển đổi dữ liệu từ object sang array với id
    const orders = Object.entries(ordersData).map(([id, data]) => ({
      id,
      ...data as Omit<Order, 'id'>
    }));
    
    callback(orders);
  });
};

/**
 * Lấy đơn hàng theo ID
 * @param orderId ID của đơn hàng
 * @returns Thông tin đơn hàng
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderData = await fetchData(`${ORDERS_PATH}/${orderId}`);
    
    if (!orderData) return null;
    
    return {
      id: orderId,
      ...orderData as Omit<Order, 'id'>
    };
  } catch (error) {
    console.error(`Lỗi khi lấy đơn hàng ${orderId}:`, error);
    throw error;
  }
};

/**
 * Lấy danh sách đơn hàng của một người dùng
 * @param userId ID của người dùng
 * @returns Danh sách đơn hàng của người dùng
 */
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    // Sử dụng query để lấy đơn hàng theo userId
    const ordersData = await queryByField(ORDERS_PATH, 'userId', userId);
    
    if (!ordersData) return [];
    
    // Chuyển đổi dữ liệu từ object sang array với id
    return Object.entries(ordersData).map(([id, data]) => ({
      id,
      ...data as Omit<Order, 'id'>
    }));
  } catch (error) {
    console.error(`Lỗi khi lấy đơn hàng của người dùng ${userId}:`, error);
    throw error;
  }
};

/**
 * Lấy đơn hàng của người dùng hiện tại
 * @returns Danh sách đơn hàng của người dùng hiện tại
 */
export const getCurrentUserOrders = async (): Promise<Order[]> => {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    throw new Error('Người dùng chưa đăng nhập');
  }
  
  return getOrdersByUserId(currentUser.uid);
};

/**
 * Cập nhật trạng thái đơn hàng
 * @param orderId ID của đơn hàng
 * @param status Trạng thái mới
 * @returns Kết quả cập nhật
 */
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
  try {
    // Cập nhật trạng thái và thời gian tương ứng
    const dataToUpdate: Record<string, any> = { status };
    
    // Thêm timestamp tương ứng với trạng thái
    const now = new Date().toISOString();
    
    switch (status) {
      case OrderStatus.PROCESSING:
        dataToUpdate.processedDate = now;
        break;
      case OrderStatus.SHIPPING:
        dataToUpdate.shippingDate = now;
        break;
      case OrderStatus.COMPLETED:
        dataToUpdate.deliveryDate = now;
        break;
      case OrderStatus.CANCELLED:
        dataToUpdate.cancelledDate = now;
        break;
    }
    
    const result = await updateData(`${ORDERS_PATH}/${orderId}`, dataToUpdate);
    return result.success;
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái đơn hàng ${orderId}:`, error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái thanh toán đơn hàng
 * @param orderId ID của đơn hàng
 * @param paymentStatus Trạng thái thanh toán mới
 * @returns Kết quả cập nhật
 */
export const updatePaymentStatus = async (orderId: string, paymentStatus: 'paid' | 'unpaid'): Promise<boolean> => {
  try {
    const result = await updateData(`${ORDERS_PATH}/${orderId}`, { paymentStatus });
    return result.success;
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái thanh toán đơn hàng ${orderId}:`, error);
    throw error;
  }
};

/**
 * Cập nhật thông tin đơn hàng
 * @param orderId ID của đơn hàng
 * @param orderData Dữ liệu cần cập nhật
 * @returns Kết quả cập nhật
 */
export const updateOrder = async (orderId: string, orderData: Partial<Order>): Promise<boolean> => {
  try {
    const result = await updateData(`${ORDERS_PATH}/${orderId}`, orderData);
    return result.success;
  } catch (error) {
    console.error(`Lỗi khi cập nhật đơn hàng ${orderId}:`, error);
    throw error;
  }
};

export const deleteOrder = async (orderId: string): Promise<boolean> => {
  try {
    const result = await updateData(`${ORDERS_PATH}/${orderId}`, { deleted: true });
    return result.success;
  } catch (error) {
    console.error(`Lỗi khi xóa đơn hàng ${orderId}:`, error);
    throw error;
  }
};

export const getOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
  try {
    const ordersData = await queryByField(ORDERS_PATH, 'status', status);
    
    if (!ordersData) return [];
    
    return Object.entries(ordersData).map(([id, data]) => ({
      id,
      ...data as Omit<Order, 'id'>
    }));
  } catch (error) {
    console.error(`Lỗi khi lấy đơn hàng theo trạng thái ${status}:`, error);
    throw error;
  }
};

export const getOrdersByPaymentMethod = async (paymentMethod: PaymentMethod): Promise<Order[]> => {
  try {
    const ordersData = await queryByField(ORDERS_PATH, 'paymentMethod', paymentMethod);
    
    if (!ordersData) return [];
    
    return Object.entries(ordersData).map(([id, data]) => ({
      id,
      ...data as Omit<Order, 'id'>
    }));
  } catch (error) {
    console.error(`Lỗi khi lấy đơn hàng theo phương thức thanh toán ${paymentMethod}:`, error);
    throw error;
  }
};

export const getOrdersByDateRange = async (startDate: string, endDate: string): Promise<Order[]> => {
  try {
    const allOrders = await getAllOrders();
    
    return allOrders.filter(order => {
      const orderDate = new Date(order.orderDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return orderDate >= start && orderDate <= end;
    });
  } catch (error) {
    console.error(`Lỗi khi lấy đơn hàng trong khoảng thời gian ${startDate} - ${endDate}:`, error);
    throw error;
  }
};

export const getOrdersByTotalRange = async (minTotal: number, maxTotal: number): Promise<Order[]> => {
  try {
    const allOrders = await getAllOrders();
    
    return allOrders.filter(order => {
      return order.total >= minTotal && order.total <= maxTotal;
    });
  } catch (error) {
    console.error(`Lỗi khi lấy đơn hàng trong khoảng tổng tiền ${minTotal} - ${maxTotal}:`, error);
    throw error;
  }
};

export const getOrdersByMultipleCriteria = async (criteria: {
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus?: 'paid' | 'unpaid' | 'refunded';
  startDate?: string;
  endDate?: string;
  minTotal?: number;
  maxTotal?: number;
}): Promise<Order[]> => {
  try {
    const allOrders = await getAllOrders();
    
    return allOrders.filter(order => {
      let matches = true;
      
      if (criteria.status) {
        matches = matches && order.status === criteria.status;
      }
      
      if (criteria.paymentMethod) {
        matches = matches && order.paymentMethod === criteria.paymentMethod;
      }
      
      if (criteria.paymentStatus) {
        matches = matches && order.paymentStatus === criteria.paymentStatus;
      }
      
      if (criteria.startDate && criteria.endDate) {
        const orderDate = new Date(order.orderDate);
        const start = new Date(criteria.startDate);
        const end = new Date(criteria.endDate);
        matches = matches && orderDate >= start && orderDate <= end;
      }
      
      if (criteria.minTotal !== undefined) {
        matches = matches && order.total >= criteria.minTotal;
      }
      
      if (criteria.maxTotal !== undefined) {
        matches = matches && order.total <= criteria.maxTotal;
      }
      
      return matches;
    });
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng theo nhiều tiêu chí:', error);
    throw error;
  }
}; 