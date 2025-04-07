import React, { useState, useEffect } from 'react';
import { Package, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderNotificationProps {
  orderId: string;
  onClose: () => void;
}

const OrderNotification: React.FC<OrderNotificationProps> = ({ orderId, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  // Tự động ẩn thông báo sau 10 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Đợi animation kết thúc rồi mới xóa component
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Chuyển đến trang theo dõi đơn hàng
  const handleTrackOrder = () => {
    navigate('/don-hang', { state: { searchOrderId: orderId } });
    onClose();
  };

  return (
    <div 
      className={`fixed top-6 right-6 z-50 w-80 bg-white rounded-xl shadow-xl border border-gray-200 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-20px]'
      }`}
    >
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl border-b border-green-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Package size={18} />
            </div>
            <h3 className="font-medium text-green-800">Đặt hàng thành công!</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 mb-2">
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Mã đơn hàng:</span>
            <span className="font-medium text-gray-800">{orderId}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <button 
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Đóng
          </button>
          <button 
            onClick={handleTrackOrder}
            className="flex items-center text-sm font-medium text-violet-600 hover:text-violet-700"
          >
            Theo dõi đơn hàng
            <ArrowRight size={14} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderNotification; 