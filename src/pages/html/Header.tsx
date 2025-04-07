import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  Phone,
  Mail,
  Clock,
  MapPin,
  ChevronDown,
  LogOut,
  Package,
  LayoutGrid,
  Home,
  Flower,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { listenToCategories } from '../../firebase/services/productService';
import { logoutUser } from '../../firebase/authService';

// Hàm tạo slug từ tên danh mục
const createSlugFromCategory = (categoryName: string): string => {
  const slug = categoryName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  console.log(`Tạo slug từ tên danh mục: "${categoryName}" -> "${slug}"`);
  return slug;
};

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const { authState, logout } = useAuth();
  const { isAuthenticated, role, userData } = authState;
  const isAdmin = role === 'admin';
  const currentUser = isAuthenticated;
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  
  // Kiểm tra xem đường dẫn hiện tại có khớp với mẫu không
  const isActivePath = (path: string) => pathname === path;
  
  // RegEx để kiểm tra đường dẫn là trang sản phẩm
  const pathRegex = /^\/products|\/product\//;

  // Cập nhật số lượng giỏ hàng
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = localStorage.getItem('cart');
        if (cart) {
          const cartItems = JSON.parse(cart);
          setCartCount(cartItems.length);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Cập nhật số lượng yêu thích
  useEffect(() => {
    // Lấy số lượng ban đầu
    const updateWishlistCount = () => {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const wishlistItems = JSON.parse(savedWishlist);
        setWishlistCount(wishlistItems.length);
      } else {
        setWishlistCount(0);
      }
    };

    // Gọi hàm cập nhật số lượng lần đầu
    updateWishlistCount();

    // Đăng ký event listener để nghe sự kiện cập nhật
    window.addEventListener('wishlistUpdated', updateWishlistCount);

    // Cleanup event listener
    return () => {
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
    };
  }, []);

  // Lắng nghe danh mục từ Firebase
  useEffect(() => {
    console.log("Header: Starting to listen to categories");
    
    const unsubscribe = listenToCategories((categoriesData) => {
      try {
        console.log("Header: Received categories data:", categoriesData);
        if (categoriesData) {
          // Chuyển đổi dữ liệu từ object sang array
          const categoriesArray = Object.entries(categoriesData).map(([id, data]: [string, any]) => ({
            id,
            ...data
          }));
          console.log("Header: Transformed categories:", categoriesArray);
          setCategories(categoriesArray);
        }
      } catch (error) {
        console.error('Error processing categories data:', error);
      }
    });

    return () => {
      unsubscribe(); // Hủy đăng ký lắng nghe khi component unmount
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    console.log(`Điều hướng đến danh mục: ${categorySlug}, URL: /products?category=${categorySlug}`);
    const url = `/products?category=${encodeURIComponent(categorySlug)}`;
    console.log(`URL đã mã hóa: ${url}`);
    navigate(url);
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = (path: string) => {
    console.log(`Điều hướng đến trang: ${path}`);
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      // Vẫn đăng xuất ngay cả khi có lỗi
      logout();
      navigate('/login');
    }
  };

  // Danh mục sản phẩm fallback nếu không có danh mục từ Firebase
  const fallbackCategories = [
    { id: 'ky-niem', name: 'Hoa kỉ niệm', slug: 'hoa-ky-niem' },
    { id: 'qua-tang', name: 'Hoa quà tặng', slug: 'hoa-qua-tang' },
    { id: 'tinh-yeu', name: 'Hoa tình yêu', slug: 'hoa-tinh-yeu' },
    { id: 'trang-tri', name: 'Hoa trang trí', slug: 'hoa-trang-tri' }
  ];

  return (
    <header className="bg-white shadow-sm z-50 sticky top-0">
      {/* Top Info Bar - Ẩn trên mobile */}
      <div className="bg-gradient-to-r from-violet-500/90 to-fuchsia-500/90 text-white py-1.5 text-xs font-light hidden md:block backdrop-blur-sm">
        <div className="container mx-auto px-4 flex justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5 hover:text-white/80 transition-colors">
              <Phone size={12} strokeWidth={2.5} className="text-pink-100" />
              <span>01234567890</span>
            </div>
            <div className="flex items-center space-x-1.5 hover:text-white/80 transition-colors">
              <Mail size={12} strokeWidth={2.5} className="text-pink-100" />
              <span>flowerstore@example.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5 hover:text-white/80 transition-colors">
              <Clock size={12} strokeWidth={2.5} className="text-pink-100" />
              <span>8:00 - 22:00</span>
            </div>
            <div className="flex items-center space-x-1.5 hover:text-white/80 transition-colors">
              <MapPin size={12} strokeWidth={2.5} className="text-pink-100" />
              <span>TP. Hồ Chí Minh</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 hover:text-violet-600 transition-all"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <button onClick={() => handleMenuItemClick('/')} className="flex items-center group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-white rounded-full p-1.5">
                    <Flower className="text-violet-500 h-7 w-7 transform transition-transform group-hover:rotate-12 duration-300" />
                  </div>
                </div>
                <div className="ml-2.5 font-bold text-2xl">
                  <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                    Violet
                  </span>
                  <span className="text-fuchsia-500">Shop</span>
                </div>
              </button>
            </div>
            
            {/* Navigation Menu - Desktop */}
            <nav className="hidden md:flex items-center space-x-10 ml-12">
              <button 
                onClick={() => handleMenuItemClick('/')}
                className={`text-sm font-medium transition-colors ${isActivePath('/') ? 'text-violet-600' : 'text-gray-700 hover:text-violet-600'}`}
              >
                Trang chủ
              </button>
              
              <div className="relative" onMouseEnter={() => setIsProductMenuOpen(true)} onMouseLeave={() => setIsProductMenuOpen(false)}>
                <button
                  className={`text-sm font-medium flex items-center gap-1 transition-colors ${pathRegex.test(pathname) ? 'text-violet-600' : 'text-gray-700 hover:text-violet-600'}`}
                >
                  Sản phẩm <ChevronDown className="h-3.5 w-3.5 transform transition-transform duration-300" style={{ transform: isProductMenuOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                
                {/* Dropdown menu with animation */}
                <div
                  className={`absolute top-full left-0 w-64 bg-white rounded-xl border border-gray-100 shadow-xl py-2 mt-1 transition-all duration-300 transform origin-top ${
                    isProductMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                >
                  {(categories.length > 0 ? categories : fallbackCategories).map((category) => (
                    <button
                      key={category.id}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                      onClick={() => handleCategoryClick(category.slug || createSlugFromCategory(category.name))}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => handleMenuItemClick('/gioi-thieu')}
                className={`text-sm font-medium transition-colors ${isActivePath('/gioi-thieu') ? 'text-violet-600' : 'text-gray-700 hover:text-violet-600'}`}
              >
                Giới thiệu
              </button>
              
              <button 
                onClick={() => handleMenuItemClick('/tin-tuc')}
                className={`text-sm font-medium transition-colors ${isActivePath('/tin-tuc') ? 'text-violet-600' : 'text-gray-700 hover:text-violet-600'}`}
              >
                Tin tức
              </button>
              
              <button 
                onClick={() => handleMenuItemClick('/lien-he')}
                className={`text-sm font-medium transition-colors ${isActivePath('/lien-he') ? 'text-violet-600' : 'text-gray-700 hover:text-violet-600'}`}
              >
                Liên hệ
              </button>
            </nav>
            
            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-6">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2.5 pl-4 pr-12 bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all text-sm"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-3.5 text-gray-400 hover:text-violet-600 transition-colors"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>
            
            {/* User Controls */}
            <div className="flex items-center space-x-5">
              <button
                onClick={() => navigate('/wishlist')} 
                className="relative hidden md:block group"
              >
                <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                  <Heart className="h-5 w-5 text-gray-600 group-hover:text-fuchsia-500 transition-colors" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => navigate('/cart')} 
                className="relative group"
              >
                <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                  <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-violet-600 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-fuchsia-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center focus:outline-none"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                >
                  <div className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <div className="h-7 w-7 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-full flex items-center justify-center overflow-hidden">
                      {currentUser && userData?.photoURL ? (
                        <img 
                          src={userData?.photoURL} 
                          alt={userData?.displayName || "User"} 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </button>
                
                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 transform transition-all duration-200 origin-top-right">
                    {currentUser ? (
                      <>
                        <div className="px-5 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-800">{userData?.displayName || 'Người dùng'}</p>
                          <p className="text-xs text-gray-500">{userData?.email || 'Chưa cập nhật'}</p>
                        </div>
                        {isAdmin && (
                          <button 
                            onClick={() => {
                              handleMenuItemClick('/admin');
                              setShowUserMenu(false);
                            }}
                            className="block w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors flex items-center gap-2.5"
                          >
                            <LayoutGrid size={16} />
                            Quản lý
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            handleMenuItemClick('/profile');
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors flex items-center gap-2.5"
                        >
                          <User size={16} />
                          Hồ sơ cá nhân
                        </button>
                        <button 
                          onClick={() => {
                            handleMenuItemClick('/orders');
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors flex items-center gap-2.5"
                        >
                          <Package size={16} />
                          Đơn hàng của tôi
                        </button>
                        <button 
                          onClick={() => navigate('/wishlist')}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-md w-full text-left"
                        >
                          <Heart size={18} className="mr-2" />
                          Danh sách yêu thích
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5"
                        >
                          <LogOut size={16} />
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => {
                            handleMenuItemClick('/Login');
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                        >
                          Đăng nhập
                        </button>
                        <button 
                          onClick={() => {
                            handleMenuItemClick('/SignUp');
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                        >
                          Đăng ký
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="mt-3 md:hidden">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 text-sm transition-all"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-violet-600 transition-colors"
              >
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div 
          className={`absolute top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-xl transition-transform duration-300 transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <button onClick={() => handleMenuItemClick('/')} className="flex items-center">
              <div className="relative bg-violet-100 rounded-full p-1.5">
                <Flower className="text-violet-500 h-5 w-5" />
              </div>
              <span className="ml-2 font-bold text-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                VioletShop
              </span>
            </button>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="py-4">
            <div className="space-y-1 px-3">
              <button 
                onClick={() => handleMenuItemClick('/')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center text-sm ${
                  isActivePath('/') ? 'bg-violet-50 text-violet-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Home size={18} className="mr-3" />
                Trang chủ
              </button>
              
              <button 
                onClick={() => handleMenuItemClick('/products')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center text-sm ${
                  pathRegex.test(pathname) ? 'bg-violet-50 text-violet-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Flower size={18} className="mr-3" />
                Tất cả sản phẩm
              </button>
              
              {/* Category Submenu */}
              <div className="pl-11 space-y-1 mt-1 mb-3">
                {(categories.length > 0 ? categories : fallbackCategories).map((category) => (
                  <button
                    key={category.id}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-violet-600 rounded-lg hover:bg-gray-50"
                    onClick={() => handleCategoryClick(category.slug || createSlugFromCategory(category.name))}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => handleMenuItemClick('/gioi-thieu')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center text-sm ${
                  isActivePath('/gioi-thieu') ? 'bg-violet-50 text-violet-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bell size={18} className="mr-3" />
                Giới thiệu
              </button>
              
              <button 
                onClick={() => handleMenuItemClick('/tin-tuc')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center text-sm ${
                  isActivePath('/tin-tuc') ? 'bg-violet-50 text-violet-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bell size={18} className="mr-3" />
                Tin tức
              </button>
              
              <button 
                onClick={() => handleMenuItemClick('/lien-he')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center text-sm ${
                  isActivePath('/lien-he') ? 'bg-violet-50 text-violet-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Mail size={18} className="mr-3" />
                Liên hệ
              </button>
            </div>
            
            <div className="border-t border-gray-100 mt-4 pt-4 px-5">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center overflow-hidden mr-3">
                      {userData?.photoURL ? (
                        <img src={userData?.photoURL} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{userData?.displayName || 'Người dùng'}</div>
                      <div className="text-xs text-gray-500">{userData?.email || 'Chưa cập nhật'}</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      handleMenuItemClick('/profile');
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2 text-left text-sm text-gray-700 flex items-center"
                  >
                    <User size={16} className="mr-2" />
                    Hồ sơ cá nhân
                  </button>
                  
                  <button 
                    onClick={() => {
                      handleMenuItemClick('/orders');
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2 text-left text-sm text-gray-700 flex items-center"
                  >
                    <Package size={16} className="mr-2" />
                    Đơn hàng của tôi
                  </button>
                  
                  <button 
                    onClick={() => navigate('/wishlist')}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-md w-full text-left"
                  >
                    <Heart size={18} className="mr-2" />
                    Danh sách yêu thích
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full py-2 text-left text-sm text-red-600 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      handleMenuItemClick('/Login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => {
                      handleMenuItemClick('/SignUp');
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2.5 border border-violet-200 text-violet-600 rounded-lg text-sm font-medium"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
