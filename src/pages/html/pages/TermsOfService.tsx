import React from 'react';
import { ScrollText, CheckCircle } from 'lucide-react';
import BasicPage from '../BasicPage';

const TermsOfService: React.FC = () => {
  return (
    <BasicPage title="Điều khoản dịch vụ" breadcrumbName="Điều khoản dịch vụ">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center">
          <div className="relative mr-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-400/30 to-fuchsia-400/30 rounded-full blur-sm"></div>
            <div className="relative p-3 rounded-full bg-white border border-violet-100 shadow-sm">
              <ScrollText className="h-6 w-6 text-gradient-violet-fuchsia bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Điều khoản dịch vụ
          </h1>
        </div>

        <div className="prose prose-violet max-w-none">
          <p className="text-gray-600 mb-8">
            Chào mừng bạn đến với Violet on Wednesday. Khi sử dụng trang web và dịch vụ của chúng tôi, 
            bạn đồng ý tuân thủ các điều khoản và điều kiện được mô tả dưới đây. 
            Vui lòng đọc kỹ các điều khoản này trước khi sử dụng dịch vụ của chúng tôi.
          </p>

          <div className="mb-8 bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
              Điều khoản sử dụng
            </h2>
            <p className="text-gray-600 mb-4">
              Bằng cách truy cập trang web này, bạn đồng ý tuân thủ các điều khoản và điều kiện, 
              cũng như tất cả các luật và quy định hiện hành, và đồng ý rằng bạn chịu trách nhiệm 
              về việc tuân thủ bất kỳ luật hiện hành nào.
            </p>
            <p className="text-gray-600">
              Nếu bạn không đồng ý với bất kỳ điều khoản nào, bạn bị cấm sử dụng hoặc truy cập trang web này. 
              Các tài liệu trong trang web này được bảo vệ bởi luật bản quyền và thương hiệu hiện hành.
            </p>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
              Tài khoản người dùng
            </h2>
            <p className="text-gray-600 mb-4">
              Khi tạo tài khoản với chúng tôi, bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật. 
              Bạn chịu trách nhiệm bảo mật tài khoản của mình, bao gồm mật khẩu, 
              và cho tất cả các hoạt động xảy ra trong tài khoản của bạn.
            </p>
            <p className="text-gray-600">
              Bạn phải thông báo cho chúng tôi ngay lập tức về bất kỳ hành vi vi phạm bảo mật hoặc sử dụng 
              trái phép tài khoản của bạn. Chúng tôi không chịu trách nhiệm về bất kỳ tổn thất nào 
              do việc bạn không tuân thủ các yêu cầu bảo mật này.
            </p>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
              Mua hàng và thanh toán
            </h2>
            <p className="text-gray-600 mb-4">
              Khi bạn thực hiện đơn đặt hàng trên trang web của chúng tôi, bạn đang đưa ra đề nghị 
              mua sản phẩm được liệt kê với giá và các điều khoản được nêu tại thời điểm đặt hàng.
            </p>
            <p className="text-gray-600 mb-4">
              Chúng tôi có quyền từ chối hoặc hủy bỏ đơn hàng của bạn vào bất kỳ lúc nào vì bất kỳ lý do gì, 
              bao gồm nhưng không giới hạn ở: tình trạng sản phẩm, lỗi về giá hoặc mô tả sản phẩm, 
              hoặc gian lận được phát hiện.
            </p>
            <p className="text-gray-600">
              Bạn đồng ý cung cấp thông tin mua hàng và tài khoản hiện tại, đầy đủ và chính xác cho tất cả 
              các giao dịch mua được thực hiện trên trang web của chúng tôi. Bạn đồng ý cập nhật kịp thời 
              tài khoản và thông tin khác, bao gồm địa chỉ email của bạn, để chúng tôi có thể hoàn thành 
              giao dịch của bạn và liên hệ với bạn khi cần thiết.
            </p>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
              Giao hàng và hoàn trả
            </h2>
            <p className="text-gray-600 mb-4">
              Chúng tôi cam kết giao hàng đúng thời hạn đã thỏa thuận. Tuy nhiên, thời gian giao hàng 
              có thể thay đổi do các yếu tố bên ngoài như điều kiện thời tiết, gián đoạn vận chuyển 
              hoặc các sự kiện bất khả kháng khác.
            </p>
            <p className="text-gray-600 mb-4">
              Nếu sản phẩm hoa tươi không đạt tiêu chuẩn chất lượng khi giao hàng, 
              bạn có quyền yêu cầu hoàn trả hoặc thay thế trong vòng 24 giờ sau khi nhận hàng. 
              Vui lòng liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi ngay khi phát hiện vấn đề.
            </p>
            <p className="text-gray-600">
              Để hoàn trả sản phẩm, cần có bằng chứng mua hàng và sản phẩm phải ở tình trạng ban đầu.
            </p>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
              Bản quyền và sở hữu trí tuệ
            </h2>
            <p className="text-gray-600 mb-4">
              Tất cả nội dung trên trang web này, bao gồm nhưng không giới hạn ở văn bản, đồ họa, 
              logo, biểu tượng, hình ảnh, clip âm thanh, tải xuống kỹ thuật số và tập hợp phần mềm, 
              là tài sản của Violet on Wednesday hoặc các nhà cung cấp nội dung của nó và được bảo vệ 
              bởi luật bản quyền và sở hữu trí tuệ quốc tế.
            </p>
            <p className="text-gray-600">
              Bạn không được sử dụng, sao chép, tái tạo, phân phối, xuất bản, hiển thị, hoặc truyền tải 
              bất kỳ nội dung nào từ trang web này mà không có sự cho phép bằng văn bản của chúng tôi.
            </p>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
              Giới hạn trách nhiệm
            </h2>
            <p className="text-gray-600 mb-4">
              Violet on Wednesday sẽ không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng 
              hoặc không có khả năng sử dụng các tài liệu trên trang web này, ngay cả khi chúng tôi hoặc 
              đại diện được ủy quyền đã được thông báo, bằng lời nói hoặc bằng văn bản, về khả năng thiệt hại đó.
            </p>
            <p className="text-gray-600">
              Một số khu vực tài phán không cho phép giới hạn về bảo đảm ngụ ý hoặc giới hạn trách nhiệm 
              đối với thiệt hại do hậu quả hoặc ngẫu nhiên, nên các giới hạn này có thể không áp dụng cho bạn.
            </p>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
              Thay đổi điều khoản
            </h2>
            <p className="text-gray-600">
              Chúng tôi có thể sửa đổi các điều khoản này vào bất kỳ lúc nào bằng cách đăng các điều khoản đã sửa đổi 
              trên trang web này. Bạn có trách nhiệm xem xét các điều khoản này định kỳ. Việc bạn tiếp tục sử dụng 
              trang web sau khi đăng bất kỳ sửa đổi nào có nghĩa là bạn chấp nhận các thay đổi đó.
            </p>
          </div>

          <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6 rounded-xl border border-violet-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Liên hệ</h2>
            <p className="text-gray-600 mb-4">
              Nếu bạn có bất kỳ câu hỏi nào về các điều khoản dịch vụ này, vui lòng liên hệ với chúng tôi:
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

export default TermsOfService; 