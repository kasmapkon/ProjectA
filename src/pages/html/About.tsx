import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronRight, Heart, Gift, Truck, Camera, Star, Clock, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-violet-700 transition-colors">Trang chủ</Link>
          <ChevronRight size={16} className="mx-1" />
          <span className="text-violet-700 font-medium">Giới thiệu</span>
        </div>
      </div>

      <div className="relative mb-20 bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl overflow-hidden p-8 md:p-12">
        <div className="absolute top-0 right-0 opacity-10 -rotate-12">
          <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="currentColor" stroke-width="1" className="text-violet-700"
              d="M10,50 C10,29.1 26.9,12.2 47.8,12.2 C68.7,12.2 85.6,29.1 85.6,50 C85.6,70.9 68.7,87.8 47.8,87.8 C26.9,87.8 10,70.9 10,50 Z" />
            <path fill="none" stroke="currentColor" stroke-width="1" className="text-violet-700"
              d="M5,50 C5,25.7 24.7,6 49,6 C73.3,6 93,25.7 93,50 C93,74.3 73.3,94 49,94 C24.7,94 5,74.3 5,50 Z" />
            <path fill="none" stroke="currentColor" stroke-width="1" className="text-violet-700"
              d="M0,50 C0,22.4 22.4,0 50,0 C77.6,0 100,22.4 100,50 C100,77.6 77.6,100 50,100 C22.4,100 0,77.6 0,50 Z" />
          </svg>
        </div>

        <div className="max-w-3xl relative">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Giới thiệu về 
            <span className="ml-2 relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">Violet on Wednesday</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-violet-200/50 -z-10 transform -rotate-1"></span>
            </span>
          </h1>
          <div className="w-20 h-1.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full mb-8"></div>
          <p className="text-lg text-gray-600 leading-relaxed mb-8 animate-fadeIn">
            Chào mừng bạn đến với Violet on Wednesday - nơi mỗi bông hoa đều kể một câu chuyện, 
            mỗi bó hoa đều mang một tâm tình. Chúng tôi tự hào giới thiệu đến bạn một không gian 
            đầy cảm hứng với những sản phẩm hoa tươi được chọn lựa kỹ càng và thiết kế tinh tế.
          </p>
        </div>
        
        <div className="absolute bottom-0 right-0 w-40 h-40 md:w-64 md:h-64 overflow-hidden rounded-tl-[100px] -mb-16 -mr-16">
          <img 
            src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=2080&auto=format&fit=crop" 
            alt="Decorative flower" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tl from-purple-600/40 to-transparent"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl transform rotate-3 -z-10"></div>
          <div className="absolute -inset-4 bg-white rounded-2xl -z-5"></div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl transform transition-transform hover:scale-[1.02] duration-500">
            <img 
              src="https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=2070&auto=format&fit=crop" 
              alt="Cửa hàng hoa Violet on Wednesday" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-lg">
              <p className="text-purple-900 font-medium">Cửa hàng chính - Quận Bình Thạnh</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            <span className="text-violet-600">Câu chuyện</span> của chúng tôi
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Violet on Wednesday ra đời vào năm 2018 bởi những người yêu hoa và có niềm đam mê với nghệ thuật 
            cắm hoa. Từ một cửa hàng nhỏ tại Quận 1, chúng tôi đã dần phát triển và mở rộng với sứ mệnh 
            mang vẻ đẹp của hoa đến với mọi người.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            Tên gọi <span className="italic font-medium">Violet on Wednesday</span> được lấy cảm hứng từ ý tưởng rằng giữa tuần là thời điểm hoàn hảo 
            để tặng hoa cho bản thân hoặc người thân yêu, tạo nên một điểm sáng giữa những ngày làm việc bận rộn.
          </p>
          
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                <Camera size={24} className="text-violet-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">1000+</p>
                <p className="text-sm text-gray-500">Mẫu thiết kế</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                <Star size={24} className="text-violet-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">4.9/5</p>
                <p className="text-sm text-gray-500">Đánh giá</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                <Users size={24} className="text-violet-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">5000+</p>
                <p className="text-sm text-gray-500">Khách hàng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-20">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Giá trị cốt lõi</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600">Những giá trị tạo nên thương hiệu và sự khác biệt của Violet on Wednesday trên thị trường hoa tươi</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
              <Heart size={30} className="text-white transform -rotate-12" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Tâm huyết</h3>
            <p className="text-gray-600 text-center">
              Chúng tôi đặt cả tâm huyết vào từng sản phẩm, từ việc lựa chọn hoa đến khâu thiết kế và đóng gói.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
              <Gift size={30} className="text-white transform -rotate-12" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Sáng tạo</h3>
            <p className="text-gray-600 text-center">
              Mỗi mẫu hoa đều là một tác phẩm nghệ thuật, được thiết kế riêng biệt để mang đến vẻ đẹp độc đáo.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
              <Truck size={30} className="text-white transform -rotate-12" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Chất lượng</h3>
            <p className="text-gray-600 text-center">
              Chúng tôi cam kết cung cấp hoa tươi chất lượng cao, đảm bảo sự hài lòng của khách hàng.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Đội ngũ của chúng tôi</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600">Những người tài năng và đam mê tạo nên những tác phẩm hoa tươi tinh tế</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Huỳnh Kiều Diễm", role: "Nhà sáng lập", id: 20 },
            { name: "Hoàng Huy Tuấn", role: "Quản lý", id: 30 },
            { name: "Nguyễn Thị Hương", role: "Nghệ nhân cắm hoa", id: 40 },
            { name: "Lê Văn Nam", role: "Chuyên gia tư vấn", id: 50 }
          ].map((member, index) => (
            <div key={index} className="group">
              <div className="relative mb-6 transition-all duration-500">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur transform -rotate-6 scale-105 transition-all duration-500"></div>
                <div className="h-56 w-56 mx-auto rounded-full overflow-hidden relative z-10 bg-white p-1">
                  <img 
                    src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${member.id}.jpg`} 
                    alt={member.name} 
                    className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-violet-700 transition-colors">{member.name}</h3>
                <p className="text-violet-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="currentColor" strokeWidth="0.5" className="text-violet-900"
              d="M0,50 C25,25 75,25 100,50 C75,75 25,75 0,50 Z" />
            <path fill="none" stroke="currentColor" strokeWidth="0.5" className="text-violet-900"
              d="M0,30 C25,5 75,5 100,30 C75,55 25,55 0,30 Z" />
            <path fill="none" stroke="currentColor" strokeWidth="0.5" className="text-violet-900"
              d="M0,70 C25,45 75,45 100,70 C75,95 25,95 0,70 Z" />
          </svg>
        </div>
        
        <div className="text-center mb-8 max-w-2xl mx-auto relative">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Cam kết của chúng tôi</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full mx-auto mb-6"></div>
        </div>
        
        <div className="relative bg-gradient-to-br from-violet-600/90 to-purple-600/90 p-10 rounded-3xl shadow-xl text-white">
          <div className="absolute top-0 right-0 -mt-6 -mr-6">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/10" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          
          <svg className="w-10 h-10 text-violet-200 mb-6 opacity-70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275z"/>
          </svg>
          
          <p className="text-lg leading-relaxed text-center font-light tracking-wide">
            Tại Violet on Wednesday, chúng tôi cam kết cung cấp những sản phẩm hoa tươi chất lượng cao nhất 
            với mức giá hợp lý. Chúng tôi luôn đảm bảo rằng mỗi đơn hàng đều được xử lý với sự chăm sóc tận tâm 
            và giao đến tay khách hàng đúng thời gian. Nếu bạn không hài lòng với sản phẩm của chúng tôi vì bất kỳ 
            lý do gì, hãy liên hệ với chúng tôi trong vòng 24 giờ và chúng tôi sẽ giải quyết vấn đề ngay lập tức.
          </p>
        </div>
      </div>

      <div>
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Liên hệ với chúng tôi</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600">Hãy ghé thăm cửa hàng hoặc liên hệ với chúng tôi qua các kênh sau</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white border border-gray-200 rounded-2xl p-8 text-center hover:border-violet-200 hover:bg-violet-50/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
            <div className="w-16 h-16 bg-violet-100 group-hover:bg-violet-200 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
              <MapPin size={30} className="text-violet-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Địa chỉ</h3>
            <p className="text-gray-600">01 Nguyễn Cửu Vân, Bình Thạnh, TP.HCM</p>
          </div>
          
          <div className="group bg-white border border-gray-200 rounded-2xl p-8 text-center hover:border-violet-200 hover:bg-violet-50/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
            <div className="w-16 h-16 bg-violet-100 group-hover:bg-violet-200 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
              <Phone size={30} className="text-violet-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Điện thoại</h3>
            <p className="text-gray-600">Hotline: 0968 159 239</p>
            <p className="text-gray-600">Cửa hàng: 08 38 40 90 92</p>
          </div>
          
          <div className="group bg-white border border-gray-200 rounded-2xl p-8 text-center hover:border-violet-200 hover:bg-violet-50/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
            <div className="w-16 h-16 bg-violet-100 group-hover:bg-violet-200 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
              <Mail size={30} className="text-violet-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Email</h3>
            <p className="text-gray-600">support@violetonwednesday.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 