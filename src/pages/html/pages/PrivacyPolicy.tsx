import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import BasicPage from '../BasicPage';

const PrivacyPolicy: React.FC = () => {
  return (
    <BasicPage title="Chính sách bảo mật" breadcrumbName="Chính sách bảo mật">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center">
          <div className="relative mr-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-400/30 to-fuchsia-400/30 rounded-full blur-sm"></div>
            <div className="relative p-3 rounded-full bg-white border border-violet-100 shadow-sm">
              <Shield className="h-6 w-6 text-gradient-violet-fuchsia bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Chính sách bảo mật
          </h1>
        </div>

        <div className="prose prose-violet max-w-none">
          <p className="text-gray-600 mb-8">
            Tại Violet on Wednesday, chúng tôi coi trọng việc bảo vệ thông tin cá nhân của khách hàng. 
            Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.
          </p>

          <div className="mb-8 bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
              Thu thập thông tin
            </h2>
            <p className="text-gray-600 mb-4">
              Chúng tôi thu thập thông tin khi bạn đăng ký tài khoản, đặt hàng, hoặc điền vào các biểu mẫu trên trang web của chúng tôi. 
              Thông tin thu thập có thể bao gồm tên, địa chỉ email, số điện thoại, địa chỉ giao hàng và thông tin thanh toán.
            </p>
            <p className="text-gray-600">
              Chúng tôi cũng tự động thu thập một số thông tin khi bạn truy cập trang web của chúng tôi, 
              bao gồm địa chỉ IP, loại trình duyệt, thời gian truy cập và các trang bạn đã xem.
            </p>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
              Sử dụng thông tin
            </h2>
            <p className="text-gray-600 mb-4">
              Chúng tôi sử dụng thông tin thu thập được để:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Xử lý đơn đặt hàng và giao hàng</li>
              <li>Cải thiện dịch vụ khách hàng và trải nghiệm người dùng</li>
              <li>Gửi thông tin về sản phẩm mới và khuyến mãi (nếu bạn đăng ký)</li>
              <li>Quản lý tài khoản của bạn và cung cấp hỗ trợ khách hàng</li>
              <li>Phân tích và cải thiện trang web của chúng tôi</li>
            </ul>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
              Bảo vệ thông tin
            </h2>
            <p className="text-gray-600 mb-4">
              Chúng tôi thực hiện nhiều biện pháp bảo mật khác nhau để duy trì an toàn cho thông tin cá nhân của bạn. 
              Tất cả thông tin nhạy cảm được truyền qua kết nối bảo mật SSL. 
              Chúng tôi tuân thủ các tiêu chuẩn ngành để bảo vệ thông tin cá nhân được gửi cho chúng tôi.
            </p>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
              Chia sẻ thông tin
            </h2>
            <p className="text-gray-600 mb-4">
              Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho các bên thứ ba 
              mà không có sự đồng ý của bạn, trừ khi cần thiết để hoàn thành dịch vụ bạn yêu cầu 
              (ví dụ: giao hàng, xử lý thanh toán) hoặc khi được yêu cầu bởi pháp luật.
            </p>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
              Quyền của bạn
            </h2>
            <p className="text-gray-600 mb-4">
              Bạn có quyền:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Truy cập và cập nhật thông tin cá nhân của bạn</li>
              <li>Yêu cầu xóa thông tin cá nhân của bạn</li>
              <li>Từ chối nhận email tiếp thị</li>
              <li>Yêu cầu thông tin về dữ liệu cá nhân mà chúng tôi lưu trữ về bạn</li>
            </ul>
            <p className="text-gray-600">
              Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua email support@violetonwednesday.com
            </p>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
              Thay đổi chính sách
            </h2>
            <p className="text-gray-600">
              Chúng tôi có thể cập nhật chính sách bảo mật này định kỳ. Khi chúng tôi thực hiện thay đổi, 
              chúng tôi sẽ đăng thông báo trên trang web của chúng tôi. 
              Chúng tôi khuyến khích người dùng thường xuyên kiểm tra trang này để cập nhật bất kỳ thay đổi nào.
            </p>
          </div>

          <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Liên hệ</h2>
            <p className="text-gray-600 mb-4">
              Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi:
            </p>
            <div className="text-gray-600">
              <p>Email: support@violetonwednesday.com</p>
              <p>Điện thoại: 08 38 40 90 92</p>
              <p>Địa chỉ: 01 Nguyễn Cửu Vân, Bình Thạnh, TP.HCM</p>
            </div>
          </div>
        </div>
      </div>
    </BasicPage>
  );
};

export default PrivacyPolicy; 