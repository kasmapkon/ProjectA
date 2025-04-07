import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Flower, ArrowRight, Heart, CreditCard, Truck, ShieldCheck, Gift, User, Sparkles } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="mt-12 relative">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-400 via-fuchsia-300 to-violet-400"></div>
      
      <div className="bg-gradient-to-br from-violet-100 via-fuchsia-50 to-purple-100 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/pattern-light.svg')] opacity-10"></div>
        <div className="absolute -bottom-6 right-0 w-64 h-64 bg-gradient-to-tr from-violet-300/20 to-fuchsia-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-gradient-to-br from-violet-300/20 to-fuchsia-300/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto relative">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-violet-100 relative">
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-violet-400/10 to-fuchsia-400/10 rotate-45 transform origin-bottom-left"></div>
              </div>
              
              <div className="text-center">
                <div className="mb-2 inline-block">
                  <span className="inline-block relative">
                    <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-400/30 to-fuchsia-400/30 blur"></span>
                    <span className="relative inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg">
                      <Mail size={24} />
                    </span>
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent">
                    Đăng ký nhận tin
                  </span>
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Nhận thông tin khuyến mãi và cập nhật mới nhất về các sản phẩm hoa tươi của chúng tôi
                </p>
                <form className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="relative w-full sm:w-auto flex-grow max-w-md group">
                    <input 
                      type="email" 
                      placeholder="Email của bạn" 
                      className="w-full px-5 py-3.5 rounded-full border border-violet-200 group-hover:border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all outline-none pl-12 bg-white/80"
                    />
                    <Mail className="absolute left-4 top-3.5 text-violet-400 group-hover:text-violet-500 transition-colors" size={20} />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-medium px-8 py-3.5 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 skew-x-30 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                    <span className="relative flex items-center justify-center">
                      Đăng ký ngay <Sparkles size={16} className="ml-1.5 text-yellow-200" />
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16 border-t border-violet-100 relative">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent top-0"></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-800 flex items-center relative">
                <span className="flex-shrink-0 flex items-center justify-center mr-3 w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full shadow-sm">
                  <Flower className="h-[18px] w-[18px] text-white" />
                </span>
                <span className="relative flex-grow">
                  DANH MỤC SẢN PHẨM
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400"></span>
                </span>
              </h4>
              <ul className="space-y-3 text-gray-600">
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/products?category=hoa-ky-niem')} className="py-1 relative cursor-pointer w-full text-left">
                    Hoa kỉ niệm
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/products?category=hoa-qua-tang')} className="py-1 relative cursor-pointer w-full text-left">
                    Hoa quà tặng
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/products?category=hoa-tinh-yeu')} className="py-1 relative cursor-pointer w-full text-left">
                    Hoa tình yêu
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/products?category=hoa-trang-tri')} className="py-1 relative cursor-pointer w-full text-left">
                    Hoa trang trí
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/products')} className="py-1 relative cursor-pointer w-full text-left">
                    Tất cả sản phẩm
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
              </ul>
            </div>
  
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-800 flex items-center relative">
                <span className="flex-shrink-0 flex items-center justify-center mr-3 w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full shadow-sm">
                  <ShieldCheck className="h-[18px] w-[18px] text-white" />
                </span>
                <span className="relative flex-grow">
                  CÔNG TY
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400"></span>
                </span>
              </h4>
              <ul className="space-y-3 text-gray-600">
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/gioi-thieu')} className="py-1 relative cursor-pointer w-full text-left">
                    Giới thiệu
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/tin-tuc')} className="py-1 relative cursor-pointer w-full text-left">
                    Tin tức & Sự kiện
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/lien-he')} className="py-1 relative cursor-pointer w-full text-left">
                    Liên hệ
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/bao-mat')} className="py-1 relative cursor-pointer w-full text-left">
                    Chính sách bảo mật
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/dieu-khoan')} className="py-1 relative cursor-pointer w-full text-left">
                    Điều khoản dịch vụ
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
              </ul>
            </div>
  
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-800 flex items-center relative">
                <span className="flex-shrink-0 flex items-center justify-center mr-3 w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full shadow-sm">
                  <User className="h-[18px] w-[18px] text-white" />
                </span>
                <span className="relative flex-grow">
                  TÀI KHOẢN
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400"></span>
                </span>
              </h4>
              <ul className="space-y-3 text-gray-600">
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/Login')} className="py-1 relative cursor-pointer w-full text-left">
                    Đăng nhập
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/SignUp')} className="py-1 relative cursor-pointer w-full text-left">
                    Đăng ký
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/cart')} className="py-1 relative cursor-pointer w-full text-left">
                    Giỏ hàng
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
                <li className="hover:text-violet-600 transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:transform group-hover:translate-x-1 duration-200" />
                  <button onClick={() => handleNavigate('/don-hang')} className="py-1 relative cursor-pointer w-full text-left">
                    Theo dõi đơn hàng
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </li>
              </ul>
            </div>
  
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-800 flex items-center relative">
                <span className="flex-shrink-0 flex items-center justify-center mr-3 w-9 h-9 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400/30 to-fuchsia-400/30 rounded-full blur-sm"></div>
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white border border-violet-100 shadow-sm">
                    <Flower className="h-[18px] w-[18px] text-violet-600" />
                  </div>
                </span>
                <span className="relative flex-grow">
                  VIOLET ON WEDNESDAY
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400"></span>
                </span>
              </h4>
              
              <div className="mb-6 p-5 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute -inset-px bg-gradient-to-r from-violet-50/0 via-violet-50/30 to-violet-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -skew-x-12 transform translate-x-full group-hover:translate-x-0"></div>
                <ul className="space-y-4 relative">
                  <li className="flex items-center text-gray-600 hover:text-violet-600 transition-colors">
                    <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 p-2 rounded-full mr-3 flex items-center justify-center w-8 h-8">
                      <MapPin size={16} className="text-violet-600" />
                    </div>
                    <span>01 Nguyễn Cửu Vân, Bình Thạnh, TP.HCM</span>
                  </li>
                  <li className="flex items-center text-gray-600 hover:text-violet-600 transition-colors">
                    <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 p-2 rounded-full mr-3 flex items-center justify-center w-8 h-8">
                      <Phone size={16} className="text-violet-600" />
                    </div>
                    <span>Điện thoại: 08 38 40 90 92</span>
                  </li>
                  <li className="flex items-center text-gray-600 hover:text-violet-600 transition-colors">
                    <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 p-2 rounded-full mr-3 flex items-center justify-center w-8 h-8">
                      <Phone size={16} className="text-violet-600" />
                    </div>
                    <span>Hotline: 0968 159 239</span>
                  </li>
                  <li className="flex items-center text-gray-600 hover:text-violet-600 transition-colors">
                    <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 p-2 rounded-full mr-3 flex items-center justify-center w-8 h-8">
                      <Mail size={16} className="text-violet-600" />
                    </div>
                    <span>support@violetonwednesday.com</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 mt-6">
                <a href="#" className="group">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white p-2 rounded-full shadow-sm border border-violet-100 group-hover:border-violet-200 text-gray-500 group-hover:text-violet-600 transition-all duration-300 flex items-center justify-center w-10 h-10">
                      <Facebook size={16} />
                    </div>
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white p-2 rounded-full shadow-sm border border-violet-100 group-hover:border-violet-200 text-gray-500 group-hover:text-violet-600 transition-all duration-300 flex items-center justify-center w-10 h-10">
                      <Twitter size={16} />
                    </div>
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white p-2 rounded-full shadow-sm border border-violet-100 group-hover:border-violet-200 text-gray-500 group-hover:text-violet-600 transition-all duration-300 flex items-center justify-center w-10 h-10">
                      <Instagram size={16} />
                    </div>
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white p-2 rounded-full shadow-sm border border-violet-100 group-hover:border-violet-200 text-gray-500 group-hover:text-violet-600 transition-all duration-300 flex items-center justify-center w-10 h-10">
                      <Youtube size={16} />
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-12 border-t border-gray-100 relative">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent top-0"></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center group">
              <div className="relative w-12 h-12 mr-4">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-xl transform group-hover:scale-110 transition-transform duration-300"></div>
                <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6 text-violet-600" />
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Giao hàng nhanh</h5>
                <p className="text-sm text-gray-500">Miễn phí với đơn lớn hơn 500K</p>
              </div>
            </div>
            
            <div className="flex items-center group">
              <div className="relative w-12 h-12 mr-4">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-xl transform group-hover:scale-110 transition-transform duration-300"></div>
                <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-violet-600" />
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Thanh toán an toàn</h5>
                <p className="text-sm text-gray-500">Nhiều phương thức</p>
              </div>
            </div>
            
            <div className="flex items-center group">
              <div className="relative w-12 h-12 mr-4">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-xl transform group-hover:scale-110 transition-transform duration-300"></div>
                <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                  <Gift className="h-6 w-6 text-violet-600" />
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Quà tặng đặc biệt</h5>
                <p className="text-sm text-gray-500">Cho đơn hàng trên 1 triệu</p>
              </div>
            </div>
            
            <div className="flex items-center group">
              <div className="relative w-12 h-12 mr-4">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-xl transform group-hover:scale-110 transition-transform duration-300"></div>
                <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-violet-600" />
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Hỗ trợ khách hàng</h5>
                <p className="text-sm text-gray-500">Hỗ trợ 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 text-white py-5 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-white/20"></div>
        <div className="absolute inset-0 bg-pattern bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-2 md:mb-0">© 2023 Violet on Wednesday Store. All Rights Reserved.</p>
            <p className="text-sm text-violet-200">Designed with <span className="text-pink-300">♥</span> by Letsop Solutions</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
  
export default Footer;
  