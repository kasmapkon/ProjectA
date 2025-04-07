import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  name: string;
  code: string;
  price: number;
  sale: number;
  imageUrl: string;
  categoryId: number;
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
}

interface AuthState {
  isAuthenticated: boolean;
  role: 'user' | 'admin' | null;
  userData: User | null;
  products: Product[];
  category:Category[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,
  userData: null,
  products: [
    {
      name: "Khai trương hồng phát 2",
      code: "VS035",
      price: 890000,
      sale: 20, categoryId:1,
      imageUrl:
        "https://storage.googleapis.com/a1aa/image/E_RG_hydnDbRqzkCQRlvAQCx3SiDqtky4gD0TCR4iq8.jpg",
    },
    {
      name: "Tình bền lâu",
      code: "VS002",
      price: 300500,
      sale: 20,categoryId:1,
      imageUrl:
        "https://storage.googleapis.com/a1aa/image/5xUYf5uWm3eNQc7bZ6kRZ7qVr1OKHrVfS6PNfczsnJw.jpg",
    },
    {
      name: "Ngày nắng",
      code: "VS005",
      price: 470500,
      sale: 20,categoryId:1,
      imageUrl:
        "https://storage.googleapis.com/a1aa/image/FefdylGOx0TFx8rA9vlcyt-Vs0nwaHCHPACeRXua-Zc.jpg",
    },
    {
      name: "Chúc mừng Tốt nghiệp",
      code: "VS004",
      price: 807500,
      sale: 20,categoryId:1,
      imageUrl:
        "https://storage.googleapis.com/a1aa/image/iBh-39malwrhEZ7yLa97Dw8Yqtsyibhh97KM2UB4mL0.jpg",
    },
    {
      name: "Tình bền lâu",
      code: "VS002",
      price: 410000,
      sale: 20,categoryId:1,
      imageUrl:
        "https://storage.googleapis.com/a1aa/image/4gKwB5zv7_nZ5A4M8bQZsSJmsdm06ib88ue6UN8j2B4.jpg",
    },
    {
      name: "Khai trương hồng phát 2",
      code: "VS035",
      price: 890000,
      sale: 20,categoryId:1,
      imageUrl:
        "https://storage.googleapis.com/a1aa/image/E_RG_hydnDbRqzkCQRlvAQCx3SiDqtky4gD0TCR4iq8.jpg",
    },
    {
      name: "Tình bền lâu",
      code: "VS002",
      price: 300500,
      sale: 20,categoryId:1,
      imageUrl:
        "https://storage.googleapis.com/a1aa/image/5xUYf5uWm3eNQc7bZ6kRZ7qVr1OKHrVfS6PNfczsnJw.jpg",
    },
    {
      name: "Ngày nắng",
      code: "VS005",
      price: 470500,
      sale: 20,categoryId:1,
      imageUrl:
        "https://storage.googleapis.com/a1aa/image/FefdylGOx0TFx8rA9vlcyt-Vs0nwaHCHPACeRXua-Zc.jpg",
    },
    {
      name: "Chúc mừng Tốt nghiệp",
      code: "VS004",
      price: 807500,
      sale: 20,categoryId:1,
      imageUrl:
        "https://storage.googleapis.com/a1aa/image/iBh-39malwrhEZ7yLa97Dw8Yqtsyibhh97KM2UB4mL0.jpg",
    },
    {
      name: "Tình bền lâu",
      code: "VS002",
      price: 410000,
      sale: 20,categoryId:1,
      imageUrl:
        "https://storage.googleapis.com/a1aa/image/4gKwB5zv7_nZ5A4M8bQZsSJmsdm06ib88ue6UN8j2B4.jpg",
    },
  ],
  category:[ 
    {id: 1,
      name: "Hoa giỏ",
      products: [
        {
          name: "Khai trương hồng phát 2",
          code: "VS035",
          price: 890000,
          sale: 20, categoryId:1,
          imageUrl:
            "https://storage.googleapis.com/a1aa/image/E_RG_hydnDbRqzkCQRlvAQCx3SiDqtky4gD0TCR4iq8.jpg",
        },
        {
          name: "Tình bền lâu",
          code: "VS002",
          price: 300500,
          sale: 20,categoryId:1,
          imageUrl:
            "https://storage.googleapis.com/a1aa/image/5xUYf5uWm3eNQc7bZ6kRZ7qVr1OKHrVfS6PNfczsnJw.jpg",
        },
        {
          name: "Ngày nắng",
          code: "VS005",
          price: 470500,
          sale: 20,categoryId:1,
          imageUrl:
            "https://storage.googleapis.com/a1aa/image/FefdylGOx0TFx8rA9vlcyt-Vs0nwaHCHPACeRXua-Zc.jpg",
        },
        {
          name: "Chúc mừng Tốt nghiệp",
          code: "VS004",
          price: 807500,
          sale: 20,categoryId:1,
          imageUrl:
            "https://storage.googleapis.com/a1aa/image/iBh-39malwrhEZ7yLa97Dw8Yqtsyibhh97KM2UB4mL0.jpg",
        },
        {
          name: "Tình bền lâu",
          code: "VS002",
          price: 410000,
          sale: 20,categoryId:1,
          imageUrl:
            "https://storage.googleapis.com/a1aa/image/4gKwB5zv7_nZ5A4M8bQZsSJmsdm06ib88ue6UN8j2B4.jpg",
        },
        {
          name: "Khai trương hồng phát 2",
          code: "VS035",
          price: 890000,
          sale: 20,categoryId:1,
          imageUrl:
            "https://storage.googleapis.com/a1aa/image/E_RG_hydnDbRqzkCQRlvAQCx3SiDqtky4gD0TCR4iq8.jpg",
        },
        {
          name: "Tình bền lâu",
          code: "VS002",
          price: 300500,
          sale: 20,categoryId:1,
          imageUrl:
            "https://storage.googleapis.com/a1aa/image/5xUYf5uWm3eNQc7bZ6kRZ7qVr1OKHrVfS6PNfczsnJw.jpg",
        },
        {
          name: "Ngày nắng",
          code: "VS005",
          price: 470500,
          sale: 20,categoryId:1,
          imageUrl:
            "https://storage.googleapis.com/a1aa/image/FefdylGOx0TFx8rA9vlcyt-Vs0nwaHCHPACeRXua-Zc.jpg",
        },
        {
          name: "Chúc mừng Tốt nghiệp",
          code: "VS004",
          price: 807500,
          sale: 20,categoryId:1,
          imageUrl:
            "https://storage.googleapis.com/a1aa/image/iBh-39malwrhEZ7yLa97Dw8Yqtsyibhh97KM2UB4mL0.jpg",
        },
        {
          name: "Tình bền lâu",
          code: "VS002",
          price: 410000,
          sale: 20,categoryId:1,
          imageUrl:
            "https://storage.googleapis.com/a1aa/image/4gKwB5zv7_nZ5A4M8bQZsSJmsdm06ib88ue6UN8j2B4.jpg",
        },
      ]
    },]
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<'user' | 'admin'>) => {
      state.isAuthenticated = true;
      state.role = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.userData = null;
    },
    register: (state, action: PayloadAction<User>) => {
      state.userData = action.payload;
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);  
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter(product => product.code === action.payload);
    },
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload; 
    },
    addCategory(state, action: PayloadAction<Category>) {
      state.category.push(action.payload);  
    },
    removeCategory(state, action: PayloadAction<number>) {
      state.category = state.category.filter(category => category.id !== action.payload);
    },
    setCategory(state, action: PayloadAction<Category[]>) {
      state.category = action.payload; 
    },
    addProductToCategory(state, action: PayloadAction<{ product: Product, categoryId: number }>) {
      const { product, categoryId } = action.payload;

      const category = state.category.find(cat => cat.id === categoryId);
      if (category) {
        category.products.push(product);
        state.products.push(product);
      }
    }
  }
});

export const { 
  login, 
  logout, 
  register,
  addProduct,
  removeProduct,
  setProducts,
  addCategory,
  removeCategory,
  setCategory,
  addProductToCategory
} = authSlice.actions;

export default authSlice.reducer;
