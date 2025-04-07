import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronRight, Send, User, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      toast.success('Tin nhắn của bạn đã được gửi thành công!');
      setFormState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 1500);
  };

  const offices = [
    {
      id: 1,
      name: 'Trụ sở chính',
      address: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      phone: '1900 123 456',
      email: 'info@violetshop.com',
      hours: 'Thứ 2 - Chủ nhật: 8:00 - 21:00',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.394854654583!2d106.70232841471814!3d10.77998356213499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f491495edf9%3A0x17da3a25a8aa9f98!2sNguyen%20Hue%20Walking%20Street!5e0!3m2!1sen!2s!4v1619498434511!5m2!1sen!2s'
    },
    {
      id: 2,
      name: 'Chi nhánh Hà Nội',
      address: '45 Phố Lê Thái Tổ, Quận Hoàn Kiếm, Hà Nội',
      phone: '1900 123 789',
      email: 'hanoi@violetshop.com',
      hours: 'Thứ 2 - Thứ 7: 8:00 - 20:00, Chủ nhật: 9:00 - 18:00',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096966609752!2d105.85096991493252!3d21.028825785998478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab953d2d93fb%3A0xf27b7cb84b9e3b99!2zNDUgTMOqIFRow6FpIFThu5UsIEjDoG5nIFRy4buRbmcsIEhvw6BuIEtp4bq_bSwgSMOgIE7hu5lpLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1619498647123!5m2!1sen!2s'
    }
  ];

  const [activeOffice, setActiveOffice] = useState(offices[0].id);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-tl from-indigo-400/20 to-purple-500/20 rounded-full blur-[100px]"></div>
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" className="text-gray-300" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4 relative">
        <Toaster position="top-right" />

        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-violet-700 transition-colors duration-300">Trang chủ</Link>
            <ChevronRight size={16} className="mx-1" />
            <span className="text-violet-700 font-medium">Liên hệ</span>
          </div>
        </div>
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-purple-600">Liên hệ với chúng tôi</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-base">Chúng tôi luôn sẵn sàng hỗ trợ và lắng nghe ý kiến từ bạn. Hãy liên hệ với chúng tôi qua form dưới đây hoặc thông tin được cung cấp.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-3">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-600 to-purple-600"></div>
              
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Gửi tin nhắn cho chúng tôi</h2>
              
              {formSubmitted ? (
                <div className="bg-violet-50 p-8 rounded-xl border border-violet-100 text-center">
                  <div className="bg-white w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle size={32} className="text-violet-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Cảm ơn bạn đã liên hệ!</h3>
                  <p className="text-gray-600 mb-6">Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Nhập họ và tên của bạn"
                        value={formState.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Nhập địa chỉ email của bạn"
                        value={formState.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Nhập số điện thoại của bạn"
                        value={formState.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Chủ đề <span className="text-red-500">*</span></label>
                      <select
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
                      >
                        <option value="">Chọn chủ đề</option>
                        <option value="order">Thông tin đơn hàng</option>
                        <option value="product">Thông tin sản phẩm</option>
                        <option value="return">Đổi/Trả hàng</option>
                        <option value="other">Vấn đề khác</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Tin nhắn <span className="text-red-500">*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Nhập nội dung tin nhắn của bạn"
                      value={formState.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative flex items-center justify-center">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <Send size={18} className="mr-2 transition-transform group-hover:translate-x-1 duration-300" />
                            Gửi tin nhắn
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-full">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Thông tin liên hệ</h2>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 uppercase font-medium tracking-wider mb-4">Chọn văn phòng</p>
                  <div className="flex space-x-3 mb-6">
                    {offices.map((office) => (
                      <button
                        key={office.id}
                        onClick={() => setActiveOffice(office.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          activeOffice === office.id
                            ? 'bg-violet-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {office.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {offices.map((office) => (
                  activeOffice === office.id && (
                    <div key={office.id} className="space-y-6">
                      <div className="flex items-start">
                        <div className="bg-violet-100 p-3 rounded-full text-violet-700 mr-4 flex-shrink-0">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Địa chỉ</h3>
                          <p className="text-gray-600">{office.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-violet-100 p-3 rounded-full text-violet-700 mr-4 flex-shrink-0">
                          <Phone size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Điện thoại</h3>
                          <p className="text-gray-600">{office.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-violet-100 p-3 rounded-full text-violet-700 mr-4 flex-shrink-0">
                          <Mail size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                          <p className="text-gray-600">{office.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-violet-100 p-3 rounded-full text-violet-700 mr-4 flex-shrink-0">
                          <Clock size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Giờ làm việc</h3>
                          <p className="text-gray-600">{office.hours}</p>
                        </div>
                      </div>
                      
                      <div className="mt-8 rounded-xl overflow-hidden shadow-lg h-48 md:h-60">
                        <iframe 
                          src={office.mapUrl} 
                          className="w-full h-full border-0" 
                          title={`Bản đồ ${office.name}`}
                          loading="lazy"
                        ></iframe>
                      </div>
                    </div>
                  )
                ))}
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 uppercase font-medium tracking-wider mb-4">Kết nối với chúng tôi</p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Twitter">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-[#ea4c89] text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Câu hỏi thường gặp</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Một số câu hỏi phổ biến mà chúng tôi thường nhận được từ khách hàng</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Thời gian giao hàng là bao lâu?</h3>
              <p className="text-gray-600">Thông thường, chúng tôi giao hàng trong vòng 2-3 giờ đối với nội thành và 3-5 giờ đối với các khu vực ngoại thành. Thời gian có thể thay đổi tùy thuộc vào khoảng cách và điều kiện giao thông.</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Có thể thay đổi hoặc hủy đơn hàng không?</h3>
              <p className="text-gray-600">Quý khách có thể thay đổi hoặc hủy đơn hàng trong vòng 1 giờ sau khi đặt hàng. Vui lòng liên hệ với chúng tôi qua số điện thoại hoặc email để được hỗ trợ nhanh nhất.</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Các phương thức thanh toán được chấp nhận?</h3>
              <p className="text-gray-600">Chúng tôi chấp nhận thanh toán qua chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay, VNPay), thẻ tín dụng/ghi nợ và thanh toán khi nhận hàng (COD).</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Làm thế nào để bảo quản hoa tươi lâu?</h3>
              <p className="text-gray-600">Để giữ hoa tươi lâu, bạn nên thay nước mỗi 1-2 ngày, cắt gốc hoa xiên 45 độ, đặt hoa ở nơi thoáng mát tránh ánh nắng trực tiếp và không để gần trái cây chín.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-1/3 -translate-y-1/2"></div>
          <div className="absolute left-0 bottom-0 w-40 h-40 bg-white/10 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Bạn cần trợ giúp ngay lập tức?</h2>
            <p className="text-white/80 mb-8">Đội ngũ tư vấn viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:1900123456" className="flex items-center justify-center gap-2 bg-white text-violet-700 font-medium px-6 py-3 rounded-lg shadow-md hover:bg-violet-50 transition-colors min-w-[180px]">
                <Phone size={18} />
                <span>1900 123 456</span>
              </a>
              <a href="mailto:support@violetshop.com" className="flex items-center justify-center gap-2 bg-violet-700/30 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-lg shadow-md hover:bg-violet-700/50 border border-white/20 transition-colors min-w-[180px]">
                <Mail size={18} />
                <span>Gửi email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 