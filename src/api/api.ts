import { 
  getAllFlowers, 
  getFlowerById, 
  updateFlower,
  addFlower, 
  deleteFlower, 
  getAllCategories, 
  getFlowersByCategory,
  getFlowerByCode,
  importFlowersFromJson,
  importCategoriesFromJson
} from '../firebase/services/productService';
import { 
  getAllUsers, 
  registerUser, 
  loginUser, 
  logoutUser, 
  updateUserData 
} from '../firebase/authService';
import { fetchData, saveData, updateData, deleteData, pushData } from '../firebase/services/database';

// Base URL của JSON Server
const API_URL = 'http://localhost:3001';

// Hàm helper để gọi API
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// API cho users
export const userAPI = {
  getAll: () => getAllUsers(),
  getById: (id: string) => fetchData(`users/${id}`),
  create: (userData: any) => registerUser(userData.email, userData.password, userData.displayName),
  update: (id: string, userData: any) => updateUserData(id, userData),
  delete: (id: string) => deleteData(`users/${id}`),
};

// API cho categories
export const categoryAPI = {
  getAll: () => getAllCategories().then(categories => {
    if (!categories) return [];
    
    // Chuyển đổi từ object sang array
    return Object.entries(categories).map(([id, data]: [string, any]) => ({
      id,
      ...data
    }));
  }),
  getById: (id: string) => fetchData(`categories/${id}`),
  create: (categoryData: any) => saveData(`categories/${categoryData.id}`, categoryData),
  update: (id: string, categoryData: any) => updateData(`categories/${id}`, categoryData),
  delete: (id: string) => deleteData(`categories/${id}`),
  importFromJson: async (jsonData: any, replaceAll: boolean = false) => {
    console.log("API - Nhập dữ liệu JSON cho danh mục");
    try {
      const result = await importCategoriesFromJson(jsonData, replaceAll);
      console.log("API - Kết quả nhập JSON danh mục:", result);
      return result;
    } catch (error: any) {
      console.error("API - Lỗi khi nhập JSON danh mục:", error);
      return {
        success: false,
        message: `Lỗi: ${error.message || 'Không xác định'}`
      };
    }
  },
};

// API cho products
export const productAPI = {
  getAll: () => getAllFlowers().then(flowers => {
    if (!flowers) return [];
    
    // Chuyển đổi từ object sang array
    return Object.entries(flowers).map(([id, data]: [string, any]) => {
      // Đảm bảo các trường cần thiết để tương thích
      const product = {
        id,
        ...data
      };
      
      // Đảm bảo có đủ các trường category
      if (product.category && !product.categoryName) {
        const categoryNameMap: { [key: string]: string } = {
          'ky-niem': 'Hoa kỉ niệm',
          'qua-tang': 'Hoa quà tặng',
          'tinh-yeu': 'Hoa tình yêu',
          'trang-tri': 'Hoa trang trí',
          'sinh-nhat': 'Hoa sinh nhật',
          'cuoi': 'Hoa cưới',
          'chuc-mung': 'Hoa chúc mừng'
        };
        
        product.categoryName = categoryNameMap[product.category] || product.category;
      }
      
      // Đảm bảo có categorySlug nếu chưa có
      if (product.category && !product.categorySlug) {
        const categorySlugMap: { [key: string]: string } = {
          'ky-niem': 'hoa-ky-niem',
          'qua-tang': 'hoa-qua-tang',
          'tinh-yeu': 'hoa-tinh-yeu',
          'trang-tri': 'hoa-trang-tri',
          'sinh-nhat': 'hoa-sinh-nhat',
          'cuoi': 'hoa-cuoi',
          'chuc-mung': 'hoa-chuc-mung'
        };
        
        product.categorySlug = categorySlugMap[product.category] || `hoa-${product.category}`;
      }
      
      return product;
    });
  }),
  getById: (id: string) => getFlowerById(id),
  getByCode: async (code: string) => {
    console.log("API - Tìm kiếm sản phẩm với mã:", code);
    try {
      // Sử dụng hàm getFlowerByCode
      const result = await getFlowerByCode(code);
      console.log("API - Kết quả tìm kiếm:", result ? "Đã tìm thấy" : "Không tìm thấy");
      return result;
    } catch (error) {
      console.error("API - Lỗi khi tìm sản phẩm:", error);
      return null;
    }
  },
  create: (productData: any) => addFlower(productData),
  update: (id: string, productData: any) => updateFlower(id, productData),
  delete: (id: string) => deleteFlower(id),
  importFromJson: async (jsonData: any, replaceAll: boolean = false) => {
    console.log("API - Nhập dữ liệu JSON cho sản phẩm");
    try {
      const result = await importFlowersFromJson(jsonData, replaceAll);
      console.log("API - Kết quả nhập JSON:", result);
      return result;
    } catch (error: any) {
      console.error("API - Lỗi khi nhập JSON:", error);
      return {
        success: false,
        message: `Lỗi: ${error.message || 'Không xác định'}`
      };
    }
  },
};

// API cho orders
export const orderAPI = {
  getAll: () => fetchData('orders').then(orders => {
    if (!orders) return [];
    
    // Chuyển đổi từ object sang array
    return Object.entries(orders).map(([id, data]: [string, any]) => ({
      id,
      ...data
    }));
  }),
  getById: (id: string) => fetchData(`orders/${id}`),
  create: (orderData: any) => pushData('orders', orderData),
  update: (id: string, orderData: any) => updateData(`orders/${id}`, orderData),
  delete: (id: string) => deleteData(`orders/${id}`),
};

// API cho statistics
export const statisticsAPI = {
  getAll: () => fetchData('statistics'),
  getCategoryStats: () => fetchData('category_stats'),
  getProductStats: () => fetchData('product_stats'),
};

export default {
  users: userAPI,
  categories: categoryAPI,
  products: productAPI,
  orders: orderAPI,
  statistics: statisticsAPI,
}; 