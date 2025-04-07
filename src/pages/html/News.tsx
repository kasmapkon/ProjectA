import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, User, ArrowRight, Clock, Tag, ChevronLeft } from 'lucide-react';

const News: React.FC = () => {
  const featuredNews = {
    id: 1,
    title: "Hoa tươi - Những màu sắc mùa xuân năm 2023",
    excerpt: "Khám phá những xu hướng hoa tươi mới nhất cho mùa xuân năm 2023 với đa dạng màu sắc và phong cách mới.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQixtMAwlPg83o6_9f9JG2G8s2SVvsrrvOTEA&s",
    date: "26/03/2023",
    author: "Huỳnh Kiều Diễm",
    category: "Xu hướng",
    readTime: "5 phút đọc"
  };

  const news = [
    {
      id: 2,
      title: "Ý nghĩa của các loại hoa hồng khác nhau",
      excerpt: "Mỗi màu sắc của hoa hồng đều mang một ý nghĩa riêng biệt. Hãy cùng tìm hiểu để chọn được loại hoa hồng phù hợp nhất cho những dịp đặc biệt.",
      imageUrl: "https://images.unsplash.com/photo-1550236520-7050f3582da0?q=80&w=1935&auto=format&fit=crop",
      date: "20/03/2023",
      author: "Nguyễn Thị Hương",
      category: "Kiến thức hoa",
      readTime: "7 phút đọc"
    },
    {
      id: 3,
      title: "5 cách bảo quản hoa tươi lâu hơn tại nhà",
      excerpt: "Làm thế nào để giữ hoa tươi lâu hơn? Hãy khám phá những mẹo đơn giản mà hiệu quả để hoa của bạn luôn tươi tắn trong nhiều ngày.",
      imageUrl: "https://images.unsplash.com/photo-1531450664978-9be7f46cb497?q=80&w=1887&auto=format&fit=crop",
      date: "15/03/2023",
      author: "Hoàng Huy Tuấn",
      category: "Mẹo hay",
      readTime: "4 phút đọc"
    },
    {
      id: 4,
      title: "Những loại hoa phù hợp cho ngày Valentine",
      excerpt: "Không chỉ có hoa hồng đỏ, còn có rất nhiều loại hoa khác cũng rất phù hợp để làm quà tặng trong ngày Valentine. Hãy cùng tìm hiểu!",
      imageUrl: "https://images.unsplash.com/photo-1518709779341-56cf4535e94b?q=80&w=1887&auto=format&fit=crop",
      date: "05/02/2023",
      author: "Lê Văn Nam",
      category: "Lễ hội & Sự kiện",
      readTime: "6 phút đọc"
    },
    {
      id: 5,
      title: "Hoa trong trang trí nhà cửa - Xu hướng 2023",
      excerpt: "Trang trí nhà cửa với hoa tươi không chỉ làm đẹp không gian sống mà còn mang lại cảm giác tươi mới và năng lượng tích cực.",
      imageUrl: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=1887&auto=format&fit=crop",
      date: "28/01/2023",
      author: "Huỳnh Kiều Diễm",
      category: "Trang trí",
      readTime: "5 phút đọc"
    },
    {
      id: 6,
      title: "Lịch sử và ý nghĩa của ngày Phụ nữ Việt Nam 20/10",
      excerpt: "Ngày 20/10 - Ngày Phụ nữ Việt Nam không chỉ là dịp để tôn vinh vẻ đẹp mà còn là dịp để trân trọng những đóng góp của phụ nữ.",
      imageUrl: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/10/17/phu-nu-viet-nam-16659989693831358806115.jpg",
      date: "15/10/2022",
      author: "Nguyễn Thị Hương",
      category: "Lễ hội & Sự kiện",
      readTime: "8 phút đọc"
    }
  ];

  const categories = [
    { name: "Tất cả", count: 15 },
    { name: "Xu hướng", count: 4 },
    { name: "Kiến thức hoa", count: 6 },
    { name: "Mẹo hay", count: 3 },
    { name: "Lễ hội & Sự kiện", count: 5 },
    { name: "Trang trí", count: 2 }
  ];

  const recentPosts = [
    {
      id: 7,
      title: "Hoa sen - Loài hoa quốc hồn quốc túy của Việt Nam",
      imageUrl: "https://blog.flowercorner.vn/wp-content/uploads/2022/01/hoa-sen-la-quoc-hoa-cua-nuoc-nao.png",
      date: "01/04/2023"
    },
    {
      id: 8,
      title: "Hoa trong văn hóa châu Á - Những biểu tượng đặc trưng",
      imageUrl: "https://blog.flowercorner.vn/wp-content/uploads/2021/12/quoc-hoa-cac-nuoc-tren-the-gioi-dong-nam-a.jpg",
      date: "22/03/2023"
    },
    {
      id: 9,
      title: "Top 10 loài hoa được ưa chuộng nhất năm 2023",
      imageUrl: "https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=2076&auto=format&fit=crop",
      date: "10/03/2023"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-violet-700 transition-colors">Trang chủ</Link>
            <ChevronRight size={16} className="mx-1" />
            <span className="text-violet-700 font-medium">Tin tức</span>
          </div>
        </div>

        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-purple-600 mb-4">Tin tức & Cập nhật</h1>
          <div className="h-1 w-20 md:w-24 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full mx-auto mb-4 md:mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">Khám phá những bài viết mới nhất về hoa tươi, mẹo chăm sóc, ý nghĩa các loài hoa và xu hướng trang trí</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-8">
            <div className="mb-10 md:mb-14 group">
              <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6 transform transition-all duration-500 group-hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img 
                  src={featuredNews.imageUrl} 
                  alt={featuredNews.title} 
                  className="w-full h-60 sm:h-80 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent z-10"></div>
                <div className="absolute top-4 left-4 bg-violet-600 text-white px-4 py-1.5 rounded-full text-sm font-medium z-20 backdrop-blur-sm">
                  Nổi bật
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20">
                  <div className="flex flex-wrap items-center text-white/90 space-x-3 mb-2 md:mb-3">
                    <div className="flex items-center text-xs md:text-sm">
                      <Calendar size={14} className="mr-1" />
                      <span>{featuredNews.date}</span>
                    </div>
                    <div className="flex items-center text-xs md:text-sm">
                      <User size={14} className="mr-1" />
                      <span>{featuredNews.author}</span>
                    </div>
                    <div className="flex items-center text-xs md:text-sm">
                      <Clock size={14} className="mr-1" />
                      <span>{featuredNews.readTime}</span>
                    </div>
                  </div>
                  <Link to={`/tin-tuc/${featuredNews.id}`} className="block">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3 group-hover:text-violet-100 transition-colors line-clamp-2">{featuredNews.title}</h2>
                  </Link>
                  <p className="text-white/80 mb-4 line-clamp-2 text-sm md:text-base">{featuredNews.excerpt}</p>
                  <Link 
                    to={`/tin-tuc/${featuredNews.id}`} 
                    className="inline-flex items-center text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all px-4 py-2 md:px-5 md:py-2.5 rounded-full group"
                  >
                    <span>Đọc tiếp</span>
                    <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 md:mb-12">
              {news.map((item) => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group h-full flex flex-col">
                  <Link to={`/tin-tuc/${item.id}`} className="block relative overflow-hidden h-48 sm:h-56">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 bg-violet-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium">
                      {item.category}
                    </div>
                  </Link>
                  <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    <div className="flex items-center text-gray-500 space-x-3 mb-2 text-xs">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        <span>{item.readTime}</span>
                      </div>
                    </div>
                    <Link to={`/tin-tuc/${item.id}`} className="block mb-auto">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-violet-700 transition-colors line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{item.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-medium text-xs mr-2">
                          {item.author.charAt(0)}
                        </div>
                        <span className="text-xs text-gray-600 truncate max-w-[100px] sm:max-w-[120px]">{item.author}</span>
                      </div>
                      <Link 
                        to={`/tin-tuc/${item.id}`} 
                        className="text-violet-600 font-medium text-xs sm:text-sm flex items-center group/link"
                      >
                        <span>Đọc tiếp</span>
                        <ArrowRight size={14} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center">
              <nav className="inline-flex items-center space-x-1 md:space-x-2 bg-white px-2 py-1.5 rounded-lg shadow-sm">
                <button className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-violet-50 hover:border-violet-300 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button 
                    key={page} 
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                      page === 1
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                        : 'border border-gray-200 text-gray-700 hover:bg-violet-50 hover:border-violet-300'
                    } transition-colors text-sm`}
                  >
                    {page}
                  </button>
                ))}
                <button className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-violet-50 hover:border-violet-300 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center">
                <Tag size={18} className="mr-2 text-violet-600" />
                Danh mục
              </h3>
              <ul className="space-y-1">
                {categories.map((category, index) => (
                  <li key={index}>
                    <button 
                      className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-violet-50 group transition-colors"
                    >
                      <span className="text-gray-700 group-hover:text-violet-700 transition-colors text-sm">{category.name}</span>
                      <span className="bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-full">{category.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center">
                <Clock size={18} className="mr-2 text-violet-600" />
                Bài viết gần đây
              </h3>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <Link to={`/tin-tuc/${post.id}`} key={post.id} className="flex items-center gap-3 group">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-violet-700 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Calendar size={10} className="mr-1" />
                        {post.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-xl shadow-lg p-5 overflow-hidden relative">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute left-0 bottom-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
              
              <h3 className="text-lg font-bold mb-3 relative flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Đăng ký nhận tin mới
              </h3>
              <p className="text-white/80 text-sm mb-4 relative">
                Nhận thông báo về bài viết mới nhất và các mẹo chăm sóc hoa hàng tuần
              </p>
              
              <form className="relative">
                <input 
                  type="email" 
                  placeholder="Email của bạn" 
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition-colors text-sm"
                />
                <button 
                  type="submit" 
                  className="w-full mt-3 bg-white text-violet-700 font-medium px-4 py-2.5 rounded-lg hover:bg-violet-50 transition-colors text-sm flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News; 