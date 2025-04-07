import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
  name: string;
  code: string;
  productCode: string;
  id: string;
  price: number;
  salePrice: number;
  sale: number;
  categoryId: number;
  category: string;
  imageUrl: string;
  description: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  tags: string[];
}

interface Category {
  id: number;
  name: string;
  products: Product[];
}

interface User {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isAdmin?: boolean;
  isDisabled?: boolean;
  role: 'user' | 'admin';
  phoneNumber?: string;
  address?: string;
  notificationPreferences?: {
    orderUpdates?: boolean;
    promotions?: boolean;
    newArrivals?: boolean;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  role: 'user' | 'admin' | null;
  userData: UserData | null;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (code: string) => void;
  setProducts: (products: Product[]) => void;
}

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Category) => void;
  removeCategory: (id: number) => void;
  setCategories: (categories: Category[]) => void;
  addProductToCategory: (product: Product, categoryId: number) => void;
}

interface AuthContextType {
  authState: AuthState;
  login: (userData: UserData) => void;
  logout: () => void;
  register: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ProductContext = createContext<ProductContextType | undefined>(undefined);
const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategories must be used within a CategoryProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    userData: null,
  });

  const login = (userData: UserData) => {
    setAuthState({ 
      isAuthenticated: true, 
      role: userData.role, 
      userData: userData
    });
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, role: null, userData: null });
  };

  const register = (user: User) => {
    setAuthState((prev) => ({ ...prev, userData: user as unknown as UserData }));
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([
    {
      name: "Khai trương hồng phát 2",
      code: "VS035",
      productCode: "VS035",
      id: "flower_vs035",
      price: 890000,
      salePrice: 712000,
      sale: 20,
      categoryId: 1,
      category: "congratulations",
      imageUrl: "https://storage.googleapis.com/a1aa/image/E_RG_hydnDbRqzkCQRlvAQCx3SiDqtky4gD0TCR4iq8.jpg",
      description: "Hoa khai trương thể hiện sự phát đạt, thịnh vượng cho doanh nghiệp",
      inStock: true,
      rating: 4.8,
      reviews: 45,
      tags: ["khai trương", "thịnh vượng", "chúc mừng"]
    },
    {
      name: "Tình bền lâu",
      code: "VS002",
      productCode: "VS002",
      id: "flower_vs002",
      price: 300500,
      salePrice: 240400,
      sale: 20,
      categoryId: 1,
      category: "love",
      imageUrl: "https://storage.googleapis.com/a1aa/image/5xUYf5uWm3eNQc7bZ6kRZ7qVr1OKHrVfS6PNfczsnJw.jpg",
      description: "Bó hoa tượng trưng cho tình yêu bền vững theo thời gian",
      inStock: true,
      rating: 4.9,
      reviews: 67,
      tags: ["tình yêu", "lãng mạn", "hoa hồng"]
    },
    {
      name: "Ngày nắng",
      code: "VS005",
      productCode: "VS005",
      id: "flower_vs005",
      price: 470500,
      salePrice: 376400,
      sale: 20,
      categoryId: 1,
      category: "birthday",
      imageUrl: "https://storage.googleapis.com/a1aa/image/FefdylGOx0TFx8rA9vlcyt-Vs0nwaHCHPACeRXua-Zc.jpg",
      description: "Bó hoa tươi sáng như ngày nắng đẹp trời, mang đến niềm vui và năng lượng tích cực",
      inStock: true,
      rating: 4.7,
      reviews: 52,
      tags: ["tươi sáng", "sinh nhật", "niềm vui"]
    },
    {
      name: "Chúc mừng Tốt nghiệp",
      code: "VS004",
      productCode: "VS004",
      id: "flower_vs004",
      price: 807500,
      salePrice: 646000,
      sale: 20,
      categoryId: 1,
      category: "congratulations",
      imageUrl: "https://storage.googleapis.com/a1aa/image/iBh-39malwrhEZ7yLa97Dw8Yqtsyibhh97KM2UB4mL0.jpg",
      description: "Hoa chúc mừng tốt nghiệp, tượng trưng cho sự thành công và khởi đầu mới",
      inStock: true,
      rating: 4.8,
      reviews: 34,
      tags: ["tốt nghiệp", "thành công", "chúc mừng"]
    },
    {
      name: "Tình bền lâu",
      code: "VS002",
      productCode: "VS002",
      id: "flower_vs002_alt",
      price: 410000,
      salePrice: 328000,
      sale: 20,
      categoryId: 1,
      category: "love",
      imageUrl: "https://storage.googleapis.com/a1aa/image/4gKwB5zv7_nZ5A4M8bQZsSJmsdm06ib88ue6UN8j2B4.jpg",
      description: "Bó hoa tượng trưng cho tình yêu bền vững theo thời gian",
      inStock: true,
      rating: 4.9,
      reviews: 71,
      tags: ["tình yêu", "lãng mạn", "hoa hồng"]
    }
  ]);

  const addProduct = (product: Product) => setProducts((prev) => [...prev, product]);
  const removeProduct = (code: string) => setProducts((prev) => prev.filter((p) => p.code !== code));

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Hoa giỏ",
      products: [
        {
          name: "Khai trương hồng phát 2",
          code: "VS035",
          productCode: "VS035",
          id: "flower_vs035",
          price: 890000,
          salePrice: 712000,
          sale: 20,
          categoryId: 1,
          category: "congratulations",
          imageUrl: "https://storage.googleapis.com/a1aa/image/E_RG_hydnDbRqzkCQRlvAQCx3SiDqtky4gD0TCR4iq8.jpg",
          description: "Hoa khai trương thể hiện sự phát đạt, thịnh vượng cho doanh nghiệp",
          inStock: true,
          rating: 4.8,
          reviews: 45,
          tags: ["khai trương", "thịnh vượng", "chúc mừng"]
        },
        {
          name: "Tình bền lâu",
          code: "VS002",
          productCode: "VS002",
          id: "flower_vs002",
          price: 300500,
          salePrice: 240400,
          sale: 20,
          categoryId: 1,
          category: "love",
          imageUrl: "https://storage.googleapis.com/a1aa/image/5xUYf5uWm3eNQc7bZ6kRZ7qVr1OKHrVfS6PNfczsnJw.jpg",
          description: "Bó hoa tượng trưng cho tình yêu bền vững theo thời gian",
          inStock: true,
          rating: 4.9,
          reviews: 67,
          tags: ["tình yêu", "lãng mạn", "hoa hồng"]
        },
        {
          name: "Ngày nắng",
          code: "VS005",
          productCode: "VS005",
          id: "flower_vs005",
          price: 470500,
          salePrice: 376400,
          sale: 20,
          categoryId: 1,
          category: "birthday",
          imageUrl: "https://storage.googleapis.com/a1aa/image/FefdylGOx0TFx8rA9vlcyt-Vs0nwaHCHPACeRXua-Zc.jpg",
          description: "Bó hoa tươi sáng như ngày nắng đẹp trời, mang đến niềm vui và năng lượng tích cực",
          inStock: true,
          rating: 4.7,
          reviews: 52,
          tags: ["tươi sáng", "sinh nhật", "niềm vui"]
        },
        {
          name: "Chúc mừng Tốt nghiệp",
          code: "VS004",
          productCode: "VS004",
          id: "flower_vs004",
          price: 807500,
          salePrice: 646000,
          sale: 20,
          categoryId: 1,
          category: "congratulations",
          imageUrl: "https://storage.googleapis.com/a1aa/image/iBh-39malwrhEZ7yLa97Dw8Yqtsyibhh97KM2UB4mL0.jpg",
          description: "Hoa chúc mừng tốt nghiệp, tượng trưng cho sự thành công và khởi đầu mới",
          inStock: true,
          rating: 4.8,
          reviews: 34,
          tags: ["tốt nghiệp", "thành công", "chúc mừng"]
        },
        {
          name: "Tình bền lâu",
          code: "VS003",
          productCode: "VS003",
          id: "flower_vs003",
          price: 410000,
          salePrice: 328000,
          sale: 20,
          categoryId: 1,
          category: "love",
          imageUrl: "https://storage.googleapis.com/a1aa/image/4gKwB5zv7_nZ5A4M8bQZsSJmsdm06ib88ue6UN8j2B4.jpg",
          description: "Bó hoa tượng trưng cho tình yêu bền vững theo thời gian",
          inStock: true,
          rating: 4.9,
          reviews: 71,
          tags: ["tình yêu", "lãng mạn", "hoa hồng"]
        },
      ],
    },
  ]);

  const addCategory = (category: Category) => setCategories((prev) => [...prev, category]);
  const removeCategory = (id: number) => setCategories((prev) => prev.filter((c) => c.id !== id));
  const addProductToCategory = (product: Product, categoryId: number) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, products: [...cat.products, product] } : cat
      )
    );
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, removeCategory, setCategories, addProductToCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
  
