import React, { useState } from 'react';
import { Eye, Search, Filter, Calendar, Clock, Download, CheckCircle } from 'lucide-react';

// Interface cho đơn hàng
interface OrderItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: 'COD' | 'banking' | 'momo';
  items: OrderItem[];
  orderDate: string;
  deliveryDate?: string;
}

const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('');

  // Dữ liệu giả lập
  const orders: Order[] = [
    {
      id: 'ORD-001',
      customerName: 'Nguyễn Thị Hương',
      customerPhone: '0923456789',
      customerEmail: 'huong@gmail.com',
      address: '123 Nguyễn Văn Cừ, Quận 5, TP.HCM',
      total: 1300000,
      status: 'completed',
      paymentMethod: 'banking',
      orderDate: '2023-11-20',
      deliveryDate: '2023-11-22',
      items: [
        {
          id: 1,
          productName: 'Bó hoa hồng đỏ rực rỡ',
          price: 450000,
          quantity: 1,
          subtotal: 450000
        },
        {
          id: 2,
          productName: 'Bó hoa tulip trắng tinh khôi',
          price: 850000,
          quantity: 1,
          subtotal: 850000
        }
      ]
    },
    {
      id: 'ORD-002',
      customerName: 'Trần Văn Nam',
      customerPhone: '0912345678',
      customerEmail: 'namtran@gmail.com',
      address: '45 Lê Lợi, Quận 1, TP.HCM',
      total: 650000,
      status: 'pending',
      paymentMethod: 'COD',
      orderDate: '2023-11-25',
      items: [
        {
          id: 1,
          productName: 'Hoa chúc mừng khai trương',
          price: 650000,
          quantity: 1,
          subtotal: 650000
        }
      ]
    },
    {
      id: 'ORD-003',
      customerName: 'Lê Thị Hoa',
      customerPhone: '0987654321',
      customerEmail: 'hoale@gmail.com',
      address: '22 Trần Hưng Đạo, Quận 1, TP.HCM',
      total: 1150000,
      status: 'processing',
      paymentMethod: 'momo',
      orderDate: '2023-11-24',
      items: [
        {
          id: 1,
          productName: 'Lẵng hoa cao cấp',
          price: 1150000,
          quantity: 1,
          subtotal: 1150000
        }
      ]
    },
    {
      id: 'ORD-004',
      customerName: 'Phạm Minh Đức',
      customerPhone: '0965432187',
      customerEmail: 'ducpham@gmail.com',
      address: '101 Võ Văn Ngân, TP Thủ Đức, TP.HCM',
      total: 900000,
      status: 'cancelled',
      paymentMethod: 'banking',
      orderDate: '2023-11-23',
      items: [
        {
          id: 1,
          productName: 'Giỏ hoa tươi mix',
          price: 450000,
          quantity: 2,
          subtotal: 900000
        }
      ]
    },
    {
      id: 'ORD-005',
      customerName: 'Võ Thị Trang',
      customerPhone: '0934567890',
      customerEmail: 'trangvo@gmail.com',
      address: '15/2 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
      total: 1550000,
      status: 'completed',
      paymentMethod: 'banking',
      orderDate: '2023-11-18',
      deliveryDate: '2023-11-19',
      items: [
        {
          id: 1,
          productName: 'Bó hoa hồng vintage',
          price: 700000,
          quantity: 1,
          subtotal: 700000
        },
        {
          id: 2,
          productName: 'Hộp quà kèm hoa',
          price: 850000,
          quantity: 1,
          subtotal: 850000
        }
      ]
    }
  ];

  // Lọc đơn hàng
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    const matchesDate = !dateFilter || order.orderDate === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleStatusChange = (orderId: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    alert(`Đơn hàng ${orderId} đã được chuyển sang trạng thái: ${newStatus}`);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'COD':
        return 'Thanh toán khi nhận hàng';
      case 'banking':
        return 'Chuyển khoản ngân hàng';
      case 'momo':
        return 'Ví MoMo';
      default:
        return method;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Quản lý đơn hàng</h1>
          
          <button
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download size={18} className="mr-2" />
            Xuất báo cáo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Tìm kiếm */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          {/* Lọc theo trạng thái */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Lọc theo ngày */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-gray-50 rounded-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <Clock size={48} className="text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg">Không tìm thấy đơn hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(order.orderDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-purple-700">{order.total.toLocaleString()} đ</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="inline-flex items-center justify-center p-2 border border-transparent rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng #{selectedOrder.id}</h2>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Đóng
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Thông tin khách hàng</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="mb-1"><span className="font-medium">Tên:</span> {selectedOrder.customerName}</p>
                <p className="mb-1"><span className="font-medium">SĐT:</span> {selectedOrder.customerPhone}</p>
                <p className="mb-1"><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                <p><span className="font-medium">Địa chỉ:</span> {selectedOrder.address}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Thông tin đơn hàng</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="mb-1">
                  <span className="font-medium">Ngày đặt:</span> {formatDate(selectedOrder.orderDate)}
                </p>
                {selectedOrder.deliveryDate && (
                  <p className="mb-1">
                    <span className="font-medium">Ngày giao:</span> {formatDate(selectedOrder.deliveryDate)}
                  </p>
                )}
                <p className="mb-1">
                  <span className="font-medium">Phương thức thanh toán:</span> {getPaymentMethodLabel(selectedOrder.paymentMethod)}
                </p>
                <p>
                  <span className="font-medium">Trạng thái:</span>{' '}
                  <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <h3 className="font-medium text-gray-700 mb-2">Sản phẩm</h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedOrder.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.price.toLocaleString()} đ</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.subtotal.toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-right font-medium">Tổng cộng:</td>
                  <td className="px-4 py-2 text-gray-900 font-bold">{selectedOrder.total.toLocaleString()} đ</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
            <div className="flex justify-end space-x-3">
              {selectedOrder.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'processing')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Xử lý đơn hàng
                </button>
              )}
              {selectedOrder.status === 'processing' && (
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <CheckCircle size={18} className="mr-2" />
                  Hoàn thành đơn hàng
                </button>
              )}
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Hủy đơn hàng
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderManagement; 