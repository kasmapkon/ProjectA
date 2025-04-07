import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Package, Tag, User, LogOut, BarChart, ShoppingBag, Menu, X, 
  Bell, Search, ChevronDown, Settings, Upload
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === `/admin/${path}` || location.pathname.startsWith(`/admin/${path}/`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const menuItems = [
    { icon: <Home size={18} />, label: 'Trang chủ', path: '', exact: true },
    { icon: <Package size={18} />, label: 'Quản lý sản phẩm', path: 'products' },
    { icon: <Tag size={18} />, label: 'Quản lý danh mục', path: 'categories' },
    { icon: <Upload size={18} />, label: 'Nhập dữ liệu sản phẩm', path: 'import-data' },
    { icon: <Upload size={18} />, label: 'Nhập dữ liệu danh mục', path: 'import-category-data' },
    { icon: <User size={18} />, label: 'Quản lý tài khoản', path: 'users' },
    { icon: <ShoppingBag size={18} />, label: 'Quản lý đơn hàng', path: 'orders' },
    { icon: <BarChart size={18} />, label: 'Thống kê', path: 'statistics' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div 
        className={`fixed inset-0 z-40 md:hidden bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setSidebarOpen(false)}
      />
      
      <div 
        className={`fixed inset-y-0 left-0 z-50 md:relative md:z-0 w-72 bg-gradient-to-b from-purple-900 to-purple-800 text-white shadow-xl transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-purple-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <span className="text-purple-800 font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-bold tracking-wide">Violet Admin</span>
          </div>
          <button 
            className="p-1 rounded-full hover:bg-purple-700/50 md:hidden transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col h-[calc(100%-5rem)] justify-between">
          <div className="px-4 py-6">
            <div className="mb-6 px-2">
              <p className="text-xs text-purple-300 font-medium uppercase tracking-wider mb-4">Điều hướng chính</p>
              <nav className="space-y-1">
                {menuItems.slice(0, 3).map((item) => (
                  <Link
                    key={item.path}
                    to={`/admin/${item.path}`}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-white/10 text-white shadow-sm backdrop-blur-sm'
                        : 'text-purple-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className={`mr-3 transition-transform ${isActive(item.path) ? 'scale-110' : ''}`}>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <span className="ml-auto w-1.5 h-6 bg-purple-400 rounded-full"></span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="mb-6 px-2">
              <p className="text-xs text-purple-300 font-medium uppercase tracking-wider mb-4">Quản lý hệ thống</p>
              <nav className="space-y-1">
                {menuItems.slice(3).map((item) => (
                  <Link
                    key={item.path}
                    to={`/admin/${item.path}`}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-white/10 text-white shadow-sm backdrop-blur-sm'
                        : 'text-purple-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className={`mr-3 transition-transform ${isActive(item.path) ? 'scale-110' : ''}`}>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <span className="ml-auto w-1.5 h-6 bg-purple-400 rounded-full"></span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="px-6 py-4 border-t border-purple-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-purple-400 ring-offset-2 ring-offset-purple-800">
                  {authState.role === 'admin' ? 'A' : 'U'}
                </div>
                <div>
                  <p className="font-medium text-white">Admin</p>
                  <p className="text-xs text-purple-300">admin@violet.com</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2.5 rounded-lg text-purple-200 hover:bg-white/10 hover:text-white transition-colors group"
              >
                <LogOut size={18} className="mr-3 group-hover:translate-x-1 transition-transform" />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-20 px-6">
            <div className="flex items-center">
              <button
                className="p-2 rounded-lg hover:bg-gray-100 md:hidden transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={22} />
              </button>
              
              <div className="hidden md:flex ml-6 text-gray-500 items-center">
                <p className="font-medium">{formatDate(currentTime)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent w-60 text-sm focus:outline-none"
                />
              </div>
              
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {notificationCount}
                  </span>
                )}
              </button>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings size={20} className="text-gray-600" />
              </button>
              
              <div className="relative">
                <button 
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center text-white font-medium">
                    {authState.role === 'admin' ? 'A' : 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="font-medium text-gray-800">Admin</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-500 hidden md:block" />
                </button>
                
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link to="/admin/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Hồ sơ cá nhân
                    </Link>
                    <Link to="/admin/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Cài đặt
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;