import React, { useState, useEffect } from 'react';
import { Truck, Search, Package, CheckCircle, Clock, ShoppingBag, ArrowRight, ArrowLeft, Loader, AlertCircle, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOrderById, getCurrentUserOrders } from '../../../../firebase/services/orderService';
import { useAuth } from '../../../../context/AuthContext';
import BasicPage from '../../BasicPage';

interface OrderItem {
  id: string;
  code: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  quantity: number;
}

interface OrderDetails {
  id: string;
  address: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  discount: number;
  shipping: number;
  items: OrderItem[];
  orderDate: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  subtotal: number;
  total: number;
  userId: string;
}

const OrderTrackingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchOrderIdFromState = location.state?.searchOrderId;

  const [orderCode, setOrderCode] = useState(searchOrderIdFromState || '');
  const [searchedOrderCode, setSearchedOrderCode] = useState('');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [userOrders, setUserOrders] = useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUserOrders, setIsLoadingUserOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();
  const { isAuthenticated } = authState;

  useEffect(() => {
    if (searchOrderIdFromState) {
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }
  }, [searchOrderIdFromState]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCode.trim()) {
      setError('Vui lòng nhập mã đơn hàng');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchedOrderCode(orderCode);

    try {
      const orderData = await getOrderById(orderCode.trim());
      if (orderData) {
        const transformedItems = orderData.items.map(item => ({
          id: item.id || '',
          code: item.code || '',
          name: item.name || '',
          imageUrl: item.imageUrl || '',
          price: item.price || 0,
          originalPrice: item.originalPrice || 0,
          quantity: item.quantity || 0
        }));
        
        const orderWithId: OrderDetails = {
          id: orderCode.trim(),
          address: orderData.address || '',
          customerEmail: orderData.customerEmail || '',
          customerName: orderData.customerName || '',
          customerPhone: orderData.customerPhone || '',
          discount: orderData.discount || 0,
          shipping: orderData.shipping || 0,
          items: transformedItems,
          orderDate: orderData.orderDate || new Date().toISOString(),
          paymentMethod: orderData.paymentMethod || 'COD',
          paymentStatus: orderData.paymentStatus || 'unpaid',
          status: orderData.status || 'pending',
          subtotal: orderData.subtotal || 0,
          total: orderData.total || 0,
          userId: orderData.userId || ''
        };
        
        setOrder(orderWithId);
      } else {
        setError('Không tìm thấy đơn hàng với mã này');
        setOrder(null);
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm đơn hàng:', error);
      setError('Đã xảy ra lỗi khi tìm kiếm đơn hàng. Vui lòng thử lại sau.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getOrderStatusInfo = (status: string): { label: string, color: string, step: number } => {
    switch (status) {
      case 'pending':
        return { label: 'Đang chờ xử lý', color: 'yellow', step: 1 };
      case 'processing':
        return { label: 'Đang xử lý', color: 'blue', step: 2 };
      case 'shipping':
        return { label: 'Đang giao hàng', color: 'orange', step: 3 };
      case 'completed':
        return { label: 'Đã giao hàng', color: 'green', step: 4 };
      case 'cancelled':
        return { label: 'Đã hủy', color: 'red', step: 0 };
      default:
        return { label: 'Không xác định', color: 'gray', step: 0 };
    }
  };

  const getPaymentStatusLabel = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'unpaid':
        return 'Chưa thanh toán';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return 'Không xác định';
    }
  };

  useEffect(() => {
    const loadUserOrders = async () => {
      if (!isAuthenticated) {
        setUserOrders([]);
        return;
      }

      setIsLoadingUserOrders(true);
      try {
        const orders = await getCurrentUserOrders();
        if (orders && orders.length > 0) {
          const transformedOrders: OrderDetails[] = orders.map(orderData => ({
            id: orderData.id || '',
            address: orderData.address || '',
            customerEmail: orderData.customerEmail || '',
            customerName: orderData.customerName || '',
            customerPhone: orderData.customerPhone || '',
            discount: orderData.discount || 0,
            shipping: orderData.shipping || 0,
            items: orderData.items.map(item => ({
              id: item.id || '',
              code: item.code || '',
              name: item.name || '',
              imageUrl: item.imageUrl || '',
              price: item.price || 0,
              originalPrice: item.originalPrice || 0,
              quantity: item.quantity || 0
            })),
            orderDate: orderData.orderDate || new Date().toISOString(),
            paymentMethod: orderData.paymentMethod || 'COD',
            paymentStatus: orderData.paymentStatus || 'unpaid',
            status: orderData.status || 'pending',
            subtotal: orderData.subtotal || 0,
            total: orderData.total || 0,
            userId: orderData.userId || ''
          }));
          
          setUserOrders(transformedOrders);
        } else {
          setUserOrders([]);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách đơn hàng:', error);
      } finally {
        setIsLoadingUserOrders(false);
      }
    };

    loadUserOrders();
  }, [isAuthenticated]);

  useEffect(() => {
    if (searchedOrderCode === 'DEMO123') {
      const demoOrder: OrderDetails = {
        id: 'DEMO123',
        customerName: 'Nguyễn Văn A',
        customerPhone: '0987654321',
        customerEmail: 'nguyenvana@example.com',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        total: 1710000,
        subtotal: 1710000,
        discount: 0,
        shipping: 0,
        status: 'processing',
        paymentMethod: 'COD',
        paymentStatus: 'unpaid',
        orderDate: '2025-03-20T19:59:11.825Z',
        userId: 'user123',
        items: [
          {
            code: 'HOABACHTRATU017',
            id: 'flower17',
            imageUrl: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/08/anh-hoa-dep-tu-nhien-18.jpg.webp',
            name: 'Bạch Trà Tú Thanh Lịch',
            originalPrice: 700000,
            price: 630000,
            quantity: 1
          },
          {
            code: 'HOAPHONG018',
            id: 'flower18',
            imageUrl: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/08/anh-hoa-dep-tu-nhien-19.jpg.webp',
            name: 'Lan Hồ Điệp Trắng Cao Cấp',
            originalPrice: 1200000,
            price: 1080000,
            quantity: 1
          }
        ]
      };
      setOrder(demoOrder);
      setError(null);
    }
  }, [searchedOrderCode]);

  const handleViewOrderDetails = (orderId: string) => {
    setOrderCode(orderId);
    handleSearch({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <BasicPage title="Theo dõi đơn hàng" breadcrumbName="Theo dõi đơn hàng">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-violet-600 transition-colors text-sm"
          >
            <ArrowLeft size={16} className="mr-1" />
            Quay lại trang chủ
          </button>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 text-violet-600 mb-4">
            <Truck size={30} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Theo dõi đơn hàng của bạn</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Nhập mã đơn hàng của bạn để kiểm tra trạng thái và theo dõi quá trình giao hàng
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                placeholder="Nhập mã đơn hàng (vd: DEMO123)"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center justify-center min-w-[120px] ${isLoading ? 'opacity-70' : ''}`}
            >
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Tra cứu</span>
                  <ArrowRight size={16} className="ml-1.5" />
                </>
              )}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start">
              <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <div className="mt-3 text-xs text-gray-500">
            * Để thử nghiệm, bạn có thể sử dụng mã đơn hàng mẫu: DEMO123
          </div>
        </div>

        {isAuthenticated && (
          <div className="mt-10">
            <div className="flex items-center mb-6">
              <FileText size={20} className="text-violet-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Đơn hàng của bạn</h2>
            </div>
            
            {isLoadingUserOrders ? (
              <div className="flex justify-center py-8">
                <div className="h-10 w-10 rounded-full border-4 border-violet-200 animate-spin border-t-violet-500"></div>
              </div>
            ) : userOrders.length > 0 ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã đơn hàng
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày đặt
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tổng tiền
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thanh toán
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userOrders.map((userOrder) => (
                        <tr key={userOrder.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {userOrder.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(userOrder.orderDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(userOrder.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              userOrder.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : userOrder.status === 'cancelled' 
                                  ? 'bg-red-100 text-red-800'
                                  : userOrder.status === 'processing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : userOrder.status === 'shipping'
                                      ? 'bg-orange-100 text-orange-800'
                                      : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {getOrderStatusInfo(userOrder.status).label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              userOrder.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : userOrder.paymentStatus === 'refunded' 
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {getPaymentStatusLabel(userOrder.paymentStatus)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewOrderDetails(userOrder.id)}
                              className="text-violet-600 hover:text-violet-900 font-medium"
                            >
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Bạn chưa có đơn hàng nào</h3>
                <p className="text-gray-500 mb-4">Hãy mua sắm và đặt hàng để xem lịch sử đơn hàng của bạn tại đây.</p>
                <button
                  onClick={() => navigate('/products')}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all"
                >
                  Mua sắm ngay
                </button>
              </div>
            )}
          </div>
        )}

        {order && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Đơn hàng #{order.id}</h2>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1.5" />
                  <span className="text-sm">{formatDate(order.orderDate)}</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">Khách hàng</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm mb-1">Liên hệ</p>
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm mb-1">Tổng giá trị</p>
                  <p className="font-medium">{formatCurrency(order.total)}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm mb-1">Thanh toán</p>
                  <p className="font-medium">
                    {order.paymentMethod === 'COD' 
                      ? 'Tiền mặt khi nhận hàng' 
                      : order.paymentMethod === 'banking' 
                        ? 'Chuyển khoản ngân hàng'
                        : 'Ví điện tử'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-violet-50 border-b border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-500 text-xs">Trạng thái đơn hàng</p>
                  <p className="font-medium text-sm">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'cancelled' 
                          ? 'bg-red-100 text-red-800'
                          : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'shipping'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getOrderStatusInfo(order.status).label}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Trạng thái thanh toán</p>
                  <p className="font-medium text-sm">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : order.paymentStatus === 'refunded' 
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Phương thức thanh toán</p>
                  <p className="font-medium text-sm">
                    {order.paymentMethod === 'COD' 
                      ? 'Tiền mặt khi nhận hàng' 
                      : order.paymentMethod === 'banking' 
                        ? 'Chuyển khoản ngân hàng'
                        : 'Ví điện tử'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className="font-medium text-sm">{order.customerEmail}</p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-100 p-6">
              <h3 className="font-medium text-gray-800 mb-3">Địa chỉ giao hàng</h3>
              <p className="text-gray-600">{order.address}</p>
            </div>

            <div className="p-6">
              <h3 className="font-medium text-gray-800 mb-6">Trạng thái đơn hàng</h3>
              
              {order.status === 'cancelled' ? (
                <div className="bg-red-50 p-4 rounded-lg flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700">Đơn hàng đã bị hủy</h4>
                    <p className="text-red-600 text-sm">Đơn hàng này đã bị hủy và không thể tiếp tục xử lý.</p>
                  </div>
                </div>
              ) : (
                <div className="relative mb-10">
                  <div className="absolute left-[15px] top-0 bottom-0 w-1 bg-gray-200 z-0"></div>
                  
                  <div className="space-y-8">
                    <div className="relative flex">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                        order.status ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <CheckCircle size={16} />
                      </div>
                      <div className="ml-6">
                        <h4 className="font-medium text-gray-800">Đơn hàng đã được xác nhận</h4>
                        <p className="text-gray-500 text-sm mt-1">{formatDate(order.orderDate)}</p>
                        <p className="text-gray-600 text-sm mt-1">Đơn hàng của bạn đã được tiếp nhận và đang chờ xử lý.</p>
                      </div>
                    </div>
                    
                    <div className="relative flex">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                        ['processing', 'shipping', 'completed'].includes(order.status) 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Package size={16} />
                      </div>
                      <div className="ml-6">
                        <h4 className={`font-medium ${
                          ['processing', 'shipping', 'completed'].includes(order.status) 
                            ? 'text-gray-800' 
                            : 'text-gray-500'
                        }`}>Đơn hàng đang được xử lý</h4>
                        <p className={`text-sm mt-1 ${
                          ['processing', 'shipping', 'completed'].includes(order.status) 
                            ? 'text-gray-600' 
                            : 'text-gray-400'
                        }`}>Chúng tôi đang chuẩn bị đơn hàng của bạn và sắp giao cho đơn vị vận chuyển.</p>
                      </div>
                    </div>
                    
                    <div className="relative flex">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                        ['shipping', 'completed'].includes(order.status) 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Truck size={16} />
                      </div>
                      <div className="ml-6">
                        <h4 className={`font-medium ${
                          ['shipping', 'completed'].includes(order.status) 
                            ? 'text-gray-800' 
                            : 'text-gray-500'
                        }`}>Đơn hàng đang được giao</h4>
                        <p className={`text-sm mt-1 ${
                          ['shipping', 'completed'].includes(order.status) 
                            ? 'text-gray-600' 
                            : 'text-gray-400'
                        }`}>Đơn hàng của bạn đã được bàn giao cho đơn vị vận chuyển và đang trên đường giao đến bạn.</p>
                      </div>
                    </div>
                    
                    <div className="relative flex">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                        order.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        <CheckCircle size={16} />
                      </div>
                      <div className="ml-6">
                        <h4 className={`font-medium ${
                          order.status === 'completed' 
                            ? 'text-gray-800' 
                            : 'text-gray-500'
                        }`}>Đã giao hàng thành công</h4>
                        <p className={`text-sm mt-1 ${
                          order.status === 'completed' 
                            ? 'text-gray-600' 
                            : 'text-gray-400'
                        }`}>Đơn hàng đã được giao thành công đến địa chỉ của bạn.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              <h3 className="font-medium text-gray-800 mb-4">Sản phẩm đã đặt</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-4 flex items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={20} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-gray-500 text-sm">Mã sản phẩm: {item.code}</p>
                        <p className="text-gray-500 text-sm">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                        {item.originalPrice > item.price && (
                          <p className="text-xs text-gray-400 line-through">{formatCurrency(item.originalPrice)}</p>
                        )}
                        <p className="text-gray-500 text-sm">{formatCurrency(item.price)} / sản phẩm</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-100 p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span className="text-gray-800">{formatCurrency(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Giảm giá:</span>
                        <span className="text-red-600">-{formatCurrency(order.discount)}</span>
                      </div>
                    )}
                    {order.shipping > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phí vận chuyển:</span>
                        <span className="text-gray-800">{formatCurrency(order.shipping)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200 mt-2">
                      <span>Tổng cộng:</span>
                      <span className="text-violet-700">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium w-full sm:w-auto flex items-center justify-center"
                >
                  <ArrowLeft size={16} className="mr-1.5" />
                  Quay lại trang chủ
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all w-full sm:w-auto flex items-center justify-center"
                >
                  <span>In thông tin đơn hàng</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BasicPage>
  );
};

export default OrderTrackingPage; 