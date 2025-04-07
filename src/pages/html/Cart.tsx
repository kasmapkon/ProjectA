import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, CreditCard, Gift, Truck, ShieldCheck, HeartHandshake } from 'lucide-react';
import BasicPage from './BasicPage';
import { useAuth } from '../../context/AuthContext';
import { createOrder, OrderStatus, PaymentMethod, Order } from '../../firebase/services/orderService';
import { getCurrentUser } from '../../firebase/authService';
import { toast } from 'react-hot-toast';
import ChatButton from '../../components/ChatButton';
import OrderNotification from '../../components/OrderNotification';
import { sendOrderNotification } from '../../firebase/services/messageService';
import { useOrder } from '../../context/OrderContext';

interface CartItem {
  id?: string;
  code?: string;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  quantity: number;
  category?: string;
  categoryName?: string;
  categorySlug?: string;
  description?: string;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  tags?: string[];
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: ''
  });
  const [showShippingForm, setShowShippingForm] = useState(true);
  const { authState } = useAuth();
  const { isAuthenticated } = authState;
  const navigate = useNavigate();
  const [orderComplete, setOrderComplete] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { setNewOrderId, newOrderId } = useOrder();

  useEffect(() => {
    const loadCartItems = () => {
      setLoading(true);
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Lỗi khi đọc giỏ hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          const userData = await getCurrentUser();
          if (userData) {
            setShippingInfo({
              fullName: userData.displayName || '',
              phone: userData.phoneNumber || '',
              email: userData.email || '',
              address: userData.address || ''
            });
          }
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
      }
    };
    
    fetchUserData();
  }, [isAuthenticated]);

  const updateCart = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const increaseQuantity = (itemCode: string) => {
    const updatedCart = cartItems.map(item => 
      (item.code === itemCode || item.id === itemCode) ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (itemCode: string) => {
    const updatedCart = cartItems.map(item => 
      (item.code === itemCode || item.id === itemCode) && item.quantity > 1 
        ? { ...item, quantity: item.quantity - 1 } 
        : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (itemCode: string) => {
    const updatedCart = cartItems.filter(item => !(item.code === itemCode || item.id === itemCode));
    updateCart(updatedCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toLowerCase() === 'sale10') {
      setCouponApplied(true);
      setCouponDiscount(Math.round(subtotal * 0.1));
    } else {
      alert("Mã giảm giá không hợp lệ!");
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping - couponDiscount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleProcessCheckout = async () => {
    try {
      if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.email || !shippingInfo.address) {
        toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
        setShowShippingForm(true);
        return;
      }

      const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
      if (!phoneRegex.test(shippingInfo.phone)) {
        toast.error('Số điện thoại không hợp lệ');
        setShowShippingForm(true);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(shippingInfo.email)) {
        toast.error('Email không hợp lệ');
        setShowShippingForm(true);
        return;
      }

      setProcessingOrder(true);
      
      const userId = isAuthenticated ? authState.userData?.uid || 'guest' : 'guest';
      
      const orderData: Omit<Order, 'id'> = {
        userId,
        customerName: shippingInfo.fullName,
        customerPhone: shippingInfo.phone,
        customerEmail: shippingInfo.email,
        address: shippingInfo.address,
        total: total,
        subtotal: subtotal,
        shipping: shipping,
        discount: couponDiscount,
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethod.COD,
        paymentStatus: PaymentMethod.COD === 'COD' ? 'unpaid' : 'paid',
        orderDate: new Date().toISOString(),
        items: cartItems.map(item => ({
          id: item.id || '',
          code: item.code || '',
          name: item.name,
          imageUrl: item.imageUrl,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: item.quantity
        }))
      };

      const newOrder = await createOrder(orderData);
      
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      
      const orderId = newOrder.id;
      setNewOrderId(orderId);
      setOrderComplete(true);
      setShowNotification(true);
      
      if (isAuthenticated && userId !== 'guest' && orderId) {
        try {
          await sendOrderNotification(userId, orderId);
        } catch (error) {
          console.error('Không thể gửi thông báo qua tin nhắn:', error);
        }
      }
      
      toast.success('Đặt hàng thành công');
      navigate('/');
    } catch (error: any) {
      console.error('Lỗi khi xử lý đơn hàng:', error);
      toast.error(`Đã xảy ra lỗi: ${error.message}`);
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <BasicPage title="Giỏ hàng" breadcrumbName="Giỏ hàng">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="h-12 w-12 rounded-full border-4 border-violet-200 animate-spin border-t-violet-500"></div>
        </div>
      </BasicPage>
    );
  }

  if (cartItems.length === 0) {
    return (
      <BasicPage title="Giỏ hàng" breadcrumbName="Giỏ hàng">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-fuchsia-400/20 rounded-full blur-sm"></div>
              <div className="relative flex items-center justify-center w-full h-full rounded-full bg-white border border-violet-100 shadow-sm">
                <ShoppingCart size={40} className="text-gray-300" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Hãy thêm sản phẩm vào giỏ hàng để tiến hành đặt hàng và trải nghiệm dịch vụ của chúng tôi.
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all"
            >
              Mua sắm ngay
            </button>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-xl border border-gray-100">
                <Truck className="text-violet-500 mb-3" size={28} />
                <h3 className="font-medium text-gray-800 mb-1">Giao hàng miễn phí</h3>
                <p className="text-center text-gray-500 text-xs">Miễn phí giao hàng cho đơn hàng từ 500.000đ</p>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-xl border border-gray-100">
                <ShieldCheck className="text-violet-500 mb-3" size={28} />
                <h3 className="font-medium text-gray-800 mb-1">Bảo đảm chất lượng</h3>
                <p className="text-center text-gray-500 text-xs">Cam kết sản phẩm chất lượng cao</p>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-xl border border-gray-100">
                <HeartHandshake className="text-violet-500 mb-3" size={28} />
                <h3 className="font-medium text-gray-800 mb-1">Đổi trả dễ dàng</h3>
                <p className="text-center text-gray-500 text-xs">Đổi trả trong vòng 7 ngày nếu không hài lòng</p>
              </div>
            </div>
          </div>
        </div>
      </BasicPage>
    );
  }

  return (
    <BasicPage title="Giỏ hàng" breadcrumbName="Giỏ hàng">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10">
          <div className="flex items-center mb-6 lg:mb-0">
            <div className="relative mr-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-400/30 to-fuchsia-400/30 rounded-full blur-sm"></div>
              <div className="relative p-3 rounded-full bg-white border border-violet-100 shadow-sm text-violet-500">
                <ShoppingCart size={22} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                  Giỏ hàng của bạn
                </span>
              </h1>
              <p className="text-gray-500 text-sm">
                {cartItems.length} sản phẩm
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/products')}
              className="px-5 py-2.5 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-medium"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
        
        <div className="lg:flex lg:gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg text-gray-800">
                    Sản phẩm trong giỏ ({cartItems.length})
                  </h2>
                  <button 
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center group transition-colors"
                  >
                    <Trash2 size={16} className="mr-1" />
                    <span>Xóa tất cả</span>
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.code || item.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition-colors">
                    <div className="sm:w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="font-medium text-gray-800 mb-1 hover:text-violet-600 transition-colors line-clamp-1">
                            <button onClick={() => navigate(`/product/${item.code || item.id}`)}>
                              {item.name}
                            </button>
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">Mã: {item.code || item.id}</p>
                        </div>
                        
                        <div className="mt-1 sm:mt-0 sm:text-right">
                          <p className="font-bold text-violet-600 text-lg">{formatPrice(item.price)}</p>
                          {item.originalPrice > item.price && (
                            <p className="text-sm text-gray-400 line-through">{formatPrice(item.originalPrice)}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                          <button 
                            onClick={() => decreaseQuantity(item.code || item.id || '')}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-violet-50 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => increaseQuantity(item.code || item.id || '')}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-violet-50 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <p className="font-medium text-gray-700">
                          Tổng: <span className="text-violet-700 font-bold">{formatPrice(item.price * item.quantity)}</span>
                        </p>
                        
                        <button 
                          onClick={() => removeItem(item.code || item.id || '')}
                          className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white">
                <h2 className="font-bold text-lg">Tóm tắt đơn hàng</h2>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-700">
                    <span>Phí vận chuyển</span>
                    <span>{shipping > 0 ? formatPrice(shipping) : 'Miễn phí'}</span>
                  </div>
                  
                  {couponApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span>- {formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-violet-700">{formatPrice(total)}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-800">Thông tin giao hàng</h3>
                    <button 
                      onClick={() => setShowShippingForm(!showShippingForm)}
                      className="text-violet-600 text-sm font-medium hover:underline"
                    >
                      {showShippingForm ? 'Ẩn thông tin' : 'Nhập thông tin'}
                    </button>
                  </div>
                  
                  {showShippingForm ? (
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="fullName" className="block text-sm text-gray-600 mb-1">Họ tên <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          id="fullName"
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                          placeholder="Nguyễn Văn A"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm text-gray-600 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                        <input
                          type="tel"
                          id="phone"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                          placeholder="0912345678"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          id="email"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                          placeholder="example@email.com"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm text-gray-600 mb-1">Địa chỉ giao hàng <span className="text-red-500">*</span></label>
                        <textarea
                          id="address"
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                          placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 min-h-[80px]"
                          required
                        ></textarea>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic mb-2">Vui lòng nhập thông tin giao hàng để tiếp tục.</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-violet-300 overflow-hidden">
                    <div className="px-4 py-2 bg-gray-50 border-r border-gray-200">
                      <Gift size={18} className="text-gray-500" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Mã giảm giá" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 py-2 px-3 focus:outline-none text-gray-700 text-sm"
                      disabled={couponApplied}
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={couponApplied || !couponCode.trim()}
                      className={`py-2 px-4 text-sm font-medium transition-colors ${
                        couponApplied 
                          ? 'bg-green-500 text-white' 
                          : couponCode.trim() 
                            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white hover:shadow-md' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {couponApplied ? 'Đã áp dụng' : 'Áp dụng'}
                    </button>
                  </div>
                  
                  <button 
                    className={`w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white py-3 rounded-lg font-medium hover:shadow-md transition-all flex items-center justify-center ${processingOrder ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={handleProcessCheckout}
                    disabled={processingOrder}
                  >
                    {processingOrder ? (
                      <>
                        <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} className="mr-2" />
                        Đặt hàng ngay
                      </>
                    )}
                  </button>
                  
                  {!isAuthenticated && (
                    <div className="text-center mt-3">
                      <button 
                        onClick={() => navigate('/login', { state: { returnUrl: '/cart' } })}
                        className="text-violet-600 text-sm font-medium hover:underline"
                      >
                        Đăng nhập để sử dụng thông tin tài khoản
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 space-y-2 pt-4 border-t border-gray-100">
                  <p>Bằng cách tiến hành đặt hàng, bạn đồng ý với:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><button onClick={() => navigate('/dieu-khoan')} className="text-violet-600 hover:underline">Điều khoản dịch vụ</button></li>
                    <li><button onClick={() => navigate('/bao-mat')} className="text-violet-600 hover:underline">Chính sách bảo mật</button></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Chúng tôi chấp nhận</h2>
              </div>
              
              <div className="p-5">
                <div className="flex gap-3 flex-wrap">
                  <div className="border border-gray-200 rounded-md p-2 w-16 h-10 flex items-center justify-center hover:shadow-sm transition-shadow">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="max-h-full" />
                  </div>
                  <div className="border border-gray-200 rounded-md p-2 w-16 h-10 flex items-center justify-center hover:shadow-sm transition-shadow">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="max-h-full" />
                  </div>
                  <div className="border border-gray-200 rounded-md p-2 w-16 h-10 flex items-center justify-center hover:shadow-sm transition-shadow">
                    <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Transparent.png" alt="MoMo" className="max-h-full" />
                  </div>
                  <div className="border border-gray-200 rounded-md p-2 w-16 h-10 flex items-center justify-center hover:shadow-sm transition-shadow">
                    <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" alt="ZaloPay" className="max-h-full" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl shadow-sm">
              <div className="flex items-center mb-3">
                <Truck size={20} className="mr-3 text-violet-500" />
                <h3 className="font-semibold text-gray-800">Thông tin giao hàng</h3>
              </div>
              <p className="text-sm mb-2 text-gray-600">Giao hàng miễn phí cho đơn hàng từ 500.000đ. Thời gian giao hàng dự kiến từ 2-4 giờ trong nội thành và 1-3 ngày đối với các tỉnh thành khác.</p>
              <p className="text-sm text-gray-600">Liên hệ hotline <span className="font-semibold text-violet-700">01234567890</span> để được hỗ trợ.</p>
            </div>
          </div>
        </div>
      </div>
      
      {showNotification && (
        <OrderNotification 
          orderId={orderComplete ? newOrderId || '' : ''} 
          onClose={() => setShowNotification(false)} 
        />
      )}
    </BasicPage>
  );
};

export default Cart; 