import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, Calendar, DollarSign, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { statisticsAPI, productAPI, categoryAPI, orderAPI } from '../../api/api';

// Interface cho dữ liệu thống kê
interface StatData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface CategoryStat {
  name: string;
  sales: number;
  revenue: number;
}

interface ProductStat {
  name: string;
  sales: number;
  revenue: number;
  code: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  orderDate: string;
  items: {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
}

interface Product {
  id: number;
  productCode: string;
  name: string;
  categoryId: number;
  price: number;
}

interface Category {
  id: number;
  name: string;
}

const Statistics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [compareWithPrevious, setCompareWithPrevious] = useState(true);
  const [chartData, setChartData] = useState<StatData[]>([]);
  const [topCategories, setTopCategories] = useState<CategoryStat[]>([]);
  const [topProducts, setTopProducts] = useState<ProductStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Lấy dữ liệu từ API
        const [ordersData, productsData, categoriesData] = await Promise.all([
          orderAPI.getAll(),
          productAPI.getAll(),
          categoryAPI.getAll(),
        ]);
        
        setOrders(ordersData);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tính toán dữ liệu thống kê khi orders, products hoặc categories thay đổi
  useEffect(() => {
    if (orders.length === 0 || products.length === 0 || categories.length === 0) return;

    // Tính toán thống kê theo ngày
    const statisticsData = calculateDailyStatistics(orders);
    setChartData(statisticsData);

    // Tính toán top danh mục
    const categoryStats = calculateCategoryStatistics(orders, products, categories);
    setTopCategories(categoryStats);

    // Tính toán top sản phẩm
    const productStats = calculateProductStatistics(orders, products);
    setTopProducts(productStats);
  }, [orders, products, categories]);

  // Hàm tính toán thống kê theo ngày
  const calculateDailyStatistics = (ordersData: Order[]): StatData[] => {
    // Tạo map để theo dõi thống kê theo ngày
    const statsMap: Map<string, StatData> = new Map();
    
    // Tạo dữ liệu cho 30 ngày gần đây
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = formatDate(date);
      statsMap.set(dateString, {
        date: dateString,
        revenue: 0,
        orders: 0,
        customers: 0
      });
    }

    // Tính toán từ dữ liệu đơn hàng
    const customerEmailsByDate: Map<string, Set<string>> = new Map();
    
    ordersData.forEach(order => {
      const orderDate = order.orderDate;
      if (statsMap.has(orderDate)) {
        const stat = statsMap.get(orderDate)!;
        // Tăng doanh thu
        stat.revenue += order.total;
        // Tăng số đơn hàng
        stat.orders += 1;
        
        // Theo dõi số khách hàng duy nhất
        if (!customerEmailsByDate.has(orderDate)) {
          customerEmailsByDate.set(orderDate, new Set());
        }
        customerEmailsByDate.get(orderDate)!.add(order.customerEmail);
        
        statsMap.set(orderDate, stat);
      }
    });
    
    // Cập nhật số khách hàng duy nhất
    customerEmailsByDate.forEach((emails, date) => {
      if (statsMap.has(date)) {
        const stat = statsMap.get(date)!;
        stat.customers = emails.size;
        statsMap.set(date, stat);
      }
    });
    
    // Chuyển map thành mảng và sắp xếp theo ngày
    return Array.from(statsMap.values()).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };

  // Hàm tính toán thống kê theo danh mục
  const calculateCategoryStatistics = (
    ordersData: Order[], 
    productsData: Product[], 
    categoriesData: Category[]
  ): CategoryStat[] => {
    // Tạo map để theo dõi thống kê theo danh mục
    const categoryStatsMap: Map<number, CategoryStat> = new Map();
    
    // Khởi tạo map với tất cả danh mục
    categoriesData.forEach(category => {
      categoryStatsMap.set(category.id, {
        name: category.name,
        sales: 0,
        revenue: 0
      });
    });
    
    // Tạo map để nhanh chóng tra cứu sản phẩm theo tên
    const productNameToProduct: Map<string, Product> = new Map();
    productsData.forEach(product => {
      productNameToProduct.set(product.name, product);
    });
    
    // Tính toán từ dữ liệu đơn hàng
    ordersData.forEach(order => {
      if (order.status === 'completed' || order.status === 'processing') {
        order.items.forEach(item => {
          const product = productNameToProduct.get(item.productName);
          if (product) {
            const categoryId = product.categoryId;
            if (categoryStatsMap.has(categoryId)) {
              const categoryStat = categoryStatsMap.get(categoryId)!;
              categoryStat.sales += item.quantity;
              categoryStat.revenue += item.subtotal;
              categoryStatsMap.set(categoryId, categoryStat);
            }
          }
        });
      }
    });
    
    // Chuyển map thành mảng và sắp xếp theo doanh thu giảm dần
    return Array.from(categoryStatsMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Lấy top 5
  };

  // Hàm tính toán thống kê theo sản phẩm
  const calculateProductStatistics = (
    ordersData: Order[], 
    productsData: Product[]
  ): ProductStat[] => {
    // Tạo map để theo dõi thống kê theo sản phẩm
    const productStatsMap: Map<string, ProductStat> = new Map();
    
    // Tạo map để nhanh chóng tra cứu sản phẩm theo tên
    const productNameToProduct: Map<string, Product> = new Map();
    productsData.forEach(product => {
      productNameToProduct.set(product.name, product);
      
      // Khởi tạo thống kê cho mỗi sản phẩm
      productStatsMap.set(product.name, {
        name: product.name,
        sales: 0,
        revenue: 0,
        code: product.productCode
      });
    });
    
    // Tính toán từ dữ liệu đơn hàng
    ordersData.forEach(order => {
      if (order.status === 'completed' || order.status === 'processing') {
        order.items.forEach(item => {
          if (productStatsMap.has(item.productName)) {
            const productStat = productStatsMap.get(item.productName)!;
            productStat.sales += item.quantity;
            productStat.revenue += item.subtotal;
            productStatsMap.set(item.productName, productStat);
          }
        });
      }
    });
    
    // Chuyển map thành mảng và sắp xếp theo doanh thu giảm dần
    return Array.from(productStatsMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Lấy top 5
  };

  // Định dạng ngày tháng YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Tính toán tổng hợp
  const currentPeriodData = chartData.slice(-getTimeRangeDays(timeRange));
  const previousPeriodData = chartData.slice(-getTimeRangeDays(timeRange) * 2, -getTimeRangeDays(timeRange));

  const currentTotalRevenue = currentPeriodData.reduce((acc, curr) => acc + curr.revenue, 0);
  const previousTotalRevenue = previousPeriodData.reduce((acc, curr) => acc + curr.revenue, 0);
  const revenueChangePercent = calculateChangePercent(previousTotalRevenue, currentTotalRevenue);

  const currentTotalOrders = currentPeriodData.reduce((acc, curr) => acc + curr.orders, 0);
  const previousTotalOrders = previousPeriodData.reduce((acc, curr) => acc + curr.orders, 0);
  const ordersChangePercent = calculateChangePercent(previousTotalOrders, currentTotalOrders);

  const currentTotalCustomers = currentPeriodData.reduce((acc, curr) => acc + curr.customers, 0);
  const previousTotalCustomers = previousPeriodData.reduce((acc, curr) => acc + curr.customers, 0);
  const customersChangePercent = calculateChangePercent(previousTotalCustomers, currentTotalCustomers);

  function getTimeRangeDays(range: string): number {
    switch (range) {
      case 'day': return 1;
      case 'week': return 7;
      case 'month': return 30;
      case 'year': return 365;
      default: return 30;
    }
  }

  function calculateChangePercent(previous: number, current: number): number {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  }

  // Tạo dữ liệu cho biểu đồ
  const maxRevenue = Math.max(
    ...currentPeriodData.map(d => d.revenue),
    ...(compareWithPrevious ? previousPeriodData.map(d => d.revenue) : [0])
  );
  
  // Chuẩn bị dữ liệu cho biểu đồ
  const getChartData = () => {
    let displayData = [];
    
    if (timeRange === 'day') {
      // Hiển thị dữ liệu theo giờ cho ngày hiện tại
      displayData = [currentPeriodData[currentPeriodData.length - 1]];
    } else if (timeRange === 'week') {
      // Hiển thị 7 ngày gần nhất
      displayData = currentPeriodData.slice(-7);
    } else if (timeRange === 'month') {
      // Hiển thị 30 ngày gần nhất, nhưng gom nhóm theo tuần
      const last30Days = currentPeriodData.slice(-30);
      
      // Nhóm theo tuần
      const weeklyData = [];
      for (let i = 0; i < 4; i++) {
        const weekData = last30Days.slice(i * 7, (i + 1) * 7);
        if (weekData.length > 0) {
          const totalRevenue = weekData.reduce((sum, day) => sum + day.revenue, 0);
          const totalOrders = weekData.reduce((sum, day) => sum + day.orders, 0);
          const totalCustomers = weekData.reduce((sum, day) => sum + day.customers, 0);
          
          // Lấy ngày đầu tuần
          const startDate = weekData[0].date;
          
          weeklyData.push({
            date: `Tuần ${i + 1} (${startDate.split('-')[2]})`,
            revenue: totalRevenue,
            orders: totalOrders,
            customers: totalCustomers,
          });
        }
      }
      displayData = weeklyData;
    } else if (timeRange === 'year') {
      // Nhóm theo tháng
      const monthlyData = [];
      const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ];
      
      // Tạo dữ liệu cho 12 tháng
      for (let month = 0; month < 12; month++) {
        // Lọc dữ liệu theo tháng
        const monthData = currentPeriodData.filter(item => {
          const itemMonth = parseInt(item.date.split('-')[1]) - 1; // Tháng trong JavaScript bắt đầu từ 0
          return itemMonth === month;
        });
        
        if (monthData.length > 0) {
          const totalRevenue = monthData.reduce((sum, day) => sum + day.revenue, 0);
          const totalOrders = monthData.reduce((sum, day) => sum + day.orders, 0);
          const totalCustomers = monthData.reduce((sum, day) => sum + day.customers, 0);
          
          monthlyData.push({
            date: monthNames[month],
            revenue: totalRevenue,
            orders: totalOrders,
            customers: totalCustomers,
          });
        } else {
          // Nếu không có dữ liệu, thêm dữ liệu trống
          monthlyData.push({
            date: monthNames[month],
            revenue: 0,
            orders: 0,
            customers: 0,
          });
        }
      }
      displayData = monthlyData;
    } else {
      displayData = currentPeriodData.slice(-getDisplayDaysCount(timeRange));
    }
    
    return displayData;
  };
  
  // Lấy dữ liệu cho biểu đồ của kỳ trước
  const getPreviousChartData = () => {
    if (!compareWithPrevious) return [];
    
    let displayData = [];
    
    if (timeRange === 'day') {
      // Hiển thị dữ liệu cho ngày trước đó
      displayData = [previousPeriodData[previousPeriodData.length - 1]];
    } else if (timeRange === 'week') {
      // Hiển thị 7 ngày của kỳ trước
      displayData = previousPeriodData.slice(-7);
    } else if (timeRange === 'month') {
      // Hiển thị kỳ trước theo tuần
      const previousMonthData = previousPeriodData.slice(-30);
      
      // Nhóm theo tuần
      const weeklyData = [];
      for (let i = 0; i < 4; i++) {
        const weekData = previousMonthData.slice(i * 7, (i + 1) * 7);
        if (weekData.length > 0) {
          const totalRevenue = weekData.reduce((sum, day) => sum + day.revenue, 0);
          const totalOrders = weekData.reduce((sum, day) => sum + day.orders, 0);
          const totalCustomers = weekData.reduce((sum, day) => sum + day.customers, 0);
          
          // Lấy ngày đầu tuần
          const startDate = weekData[0].date;
          
          weeklyData.push({
            date: `Tuần ${i + 1} (${startDate.split('-')[2]})`,
            revenue: totalRevenue,
            orders: totalOrders,
            customers: totalCustomers,
          });
        }
      }
      displayData = weeklyData;
    } else if (timeRange === 'year') {
      // Nhóm theo tháng cho kỳ trước
      const monthlyData = [];
      const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ];
      
      // Tạo dữ liệu cho 12 tháng
      for (let month = 0; month < 12; month++) {
        // Lọc dữ liệu theo tháng
        const monthData = previousPeriodData.filter(item => {
          const itemMonth = parseInt(item.date.split('-')[1]) - 1;
          return itemMonth === month;
        });
        
        if (monthData.length > 0) {
          const totalRevenue = monthData.reduce((sum, day) => sum + day.revenue, 0);
          const totalOrders = monthData.reduce((sum, day) => sum + day.orders, 0);
          const totalCustomers = monthData.reduce((sum, day) => sum + day.customers, 0);
          
          monthlyData.push({
            date: monthNames[month],
            revenue: totalRevenue,
            orders: totalOrders,
            customers: totalCustomers,
          });
        } else {
          // Nếu không có dữ liệu, thêm dữ liệu trống
          monthlyData.push({
            date: monthNames[month],
            revenue: 0,
            orders: 0,
            customers: 0,
          });
        }
      }
      displayData = monthlyData;
    } else {
      displayData = previousPeriodData.slice(-getDisplayDaysCount(timeRange));
    }
    
    return displayData;
  };
  
  const displayPeriodData = getChartData();
  const previousDisplayData = getPreviousChartData();

  function getDisplayDaysCount(range: string): number {
    switch (range) {
      case 'day': return 24; // Hiển thị theo giờ
      case 'week': return 7;
      case 'month': return 30;
      case 'year': return 12; // Hiển thị theo tháng
      default: return 30;
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Thống kê</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as 'day' | 'week' | 'month' | 'year')}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="day">Hôm nay</option>
                <option value="week">7 ngày qua</option>
                <option value="month">30 ngày qua</option>
                <option value="year">365 ngày qua</option>
              </select>
            </div>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={compareWithPrevious}
                onChange={(e) => setCompareWithPrevious(e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">So sánh với kỳ trước</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign size={20} className="text-purple-600" />
                </div>
                <h3 className="ml-3 text-gray-500">Doanh thu</h3>
              </div>
              <div className={`flex items-center ${revenueChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueChangePercent >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="ml-1 text-sm font-medium">{Math.abs(revenueChangePercent).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {currentTotalRevenue.toLocaleString('vi-VN')}đ
            </p>
            {compareWithPrevious && (
              <p className="text-sm text-gray-500 mt-1">
                Kỳ trước: {previousTotalRevenue.toLocaleString('vi-VN')}đ
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag size={20} className="text-blue-600" />
                </div>
                <h3 className="ml-3 text-gray-500">Đơn hàng</h3>
              </div>
              <div className={`flex items-center ${ordersChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {ordersChangePercent >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="ml-1 text-sm font-medium">{Math.abs(ordersChangePercent).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{currentTotalOrders}</p>
            {compareWithPrevious && (
              <p className="text-sm text-gray-500 mt-1">
                Kỳ trước: {previousTotalOrders}
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users size={20} className="text-green-600" />
                </div>
                <h3 className="ml-3 text-gray-500">Khách hàng</h3>
              </div>
              <div className={`flex items-center ${customersChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {customersChangePercent >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="ml-1 text-sm font-medium">{Math.abs(customersChangePercent).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{currentTotalCustomers}</p>
            {compareWithPrevious && (
              <p className="text-sm text-gray-500 mt-1">
                Kỳ trước: {previousTotalCustomers}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top danh mục bán chạy</h2>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium">
                      {index + 1}
                    </span>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.sales} sản phẩm đã bán</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {category.revenue.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top sản phẩm bán chạy</h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium">
                      {index + 1}
                    </span>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-500">Mã: {product.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {product.revenue.toLocaleString('vi-VN')}đ
                    </p>
                    <p className="text-xs text-gray-500">{product.sales} đã bán</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 