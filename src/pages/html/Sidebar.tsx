import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, User, ChevronRight, Tag, Clock, Heart, Flower, Gift, Calendar, Award, Search, Filter, ShoppingBag, Sparkles, Percent, TrendingUp } from 'lucide-react';
import { listenToFlowers } from '../../firebase/services/productService';

interface FlowerProduct {
  id?: string;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  code?: string;
  productCode?: string;
  reviews?: number;
  category?: string;
  categoryName?: string;
  categorySlug?: string;
  description?: string;
  inStock?: boolean;
  rating?: number;
  tags?: string[];
  [key: string]: any;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const [bestSellingProducts, setBestSellingProducts] = useState<FlowerProduct[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<FlowerProduct[]>([]);

  const handleCategoryClick = (category: string) => {
    console.log(`Điều hướng đến danh mục: ${category}`);
    const url = `/products?category=${encodeURIComponent(category)}`;
    console.log(`URL đã mã hóa: ${url}`);
    navigate(url);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price).replace('₫', 'đ');
  };

  const calculateDiscount = (price: number, salePrice: number) => {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

  useEffect(() => {
    const unsubscribe = listenToFlowers((flowersData) => {
      if (flowersData) {
        const productsArray = Object.values(flowersData) as FlowerProduct[];
        
        const topSelling = [...productsArray]
          .sort((a: FlowerProduct, b: FlowerProduct) => (b.reviews || 0) - (a.reviews || 0))
          .slice(0, 3);
        
        const discounted = productsArray
          .filter((product: FlowerProduct) => product.salePrice && product.salePrice < product.price)
          .sort((a: FlowerProduct, b: FlowerProduct) => {
            const discountA = calculateDiscount(a.price, a.salePrice || a.price);
            const discountB = calculateDiscount(b.price, b.salePrice || b.price);
            return discountB - discountA;
          })
          .slice(0, 3);
        
        setBestSellingProducts(topSelling);
        setDiscountedProducts(discounted);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 blur"></div>
          <div className="relative bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white p-4">
            <h2 className="text-lg font-bold flex items-center">
              <ShoppingBag size={18} className="mr-2" />
              Danh Mục Sản Phẩm
            </h2>
          </div>
        </div>
        <div className="p-3">
          <button 
            onClick={() => handleCategoryClick('hoa-ky-niem')}
            className="w-full text-left px-4 py-3 rounded-lg flex items-center justify-between hover:bg-violet-50 group transition-colors mb-1"
          >
            <span className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                <Calendar size={16} className="text-blue-500" />
              </div>
              <span className="text-gray-700 group-hover:text-violet-700 font-medium">Hoa kỉ niệm</span>
            </span>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-violet-600 transform group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => handleCategoryClick('hoa-qua-tang')}
            className="w-full text-left px-4 py-3 rounded-lg flex items-center justify-between hover:bg-violet-50 group transition-colors mb-1"
          >
            <span className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center mr-3 group-hover:bg-pink-100 transition-colors">
                <Gift size={16} className="text-pink-500" />
              </div>
              <span className="text-gray-700 group-hover:text-violet-700 font-medium">Hoa quà tặng</span>
            </span>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-violet-600 transform group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => handleCategoryClick('hoa-tinh-yeu')}
            className="w-full text-left px-4 py-3 rounded-lg flex items-center justify-between hover:bg-violet-50 group transition-colors mb-1"
          >
            <span className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors">
                <Heart size={16} className="text-red-500" />
              </div>
              <span className="text-gray-700 group-hover:text-violet-700 font-medium">Hoa tình yêu</span>
            </span>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-violet-600 transform group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => handleCategoryClick('hoa-trang-tri')}
            className="w-full text-left px-4 py-3 rounded-lg flex items-center justify-between hover:bg-violet-50 group transition-colors"
          >
            <span className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center mr-3 group-hover:bg-violet-100 transition-colors">
                <Flower size={16} className="text-violet-500" />
              </div>
              <span className="text-gray-700 group-hover:text-violet-700 font-medium">Hoa trang trí</span>
            </span>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-violet-600 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 blur"></div>
          <div className="relative bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white p-4">
            <h2 className="text-lg font-bold flex items-center">
              <TrendingUp size={18} className="mr-2" />
              Sản Phẩm Bán Chạy
            </h2>
          </div>
        </div>
        <div className="p-4 divide-y divide-gray-100">
          {bestSellingProducts.length > 0 ? (
            bestSellingProducts.map((product, index) => (
              <Link key={product.id || index} to={`/product/${product.code || product.productCode || product.id}`} className="flex items-center gap-4 py-3 group">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                  />
                  {product.reviews && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-bold py-1 px-2 rounded-full shadow-sm">
                      {product.reviews}+
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800 group-hover:text-violet-700 transition line-clamp-2">{product.name}</h3>
                  <div className="flex items-center mt-1">
                    <p className="text-violet-700 font-bold text-sm">
                      {formatPrice(product.salePrice || product.price)}
                    </p>
                    {product.salePrice && product.salePrice < product.price && (
                      <p className="text-gray-400 text-xs line-through ml-2">{formatPrice(product.price)}</p>
                    )}
                  </div>
                  <div className="mt-1.5">
                    <button className="text-xs text-violet-600 hover:text-fuchsia-600 transition-colors font-medium flex items-center">
                      Xem chi tiết
                      <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-4 text-center text-gray-500 text-sm">
              Đang tải sản phẩm...
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 blur"></div>
          <div className="relative bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white p-4">
            <h2 className="text-lg font-bold flex items-center">
              <Sparkles size={18} className="mr-2" />
              Sản Phẩm Khuyến Mãi
            </h2>
          </div>
        </div>
        <div className="p-4 divide-y divide-gray-100">
          {discountedProducts.length > 0 ? (
            discountedProducts.map((product, index) => (
              <Link key={product.id || index} to={`/product/${product.code || product.productCode || product.id}`} className="flex items-center gap-4 py-3 group">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                  />
                  {product.reviews && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-bold py-1 px-2 rounded-full shadow-sm">
                      {product.reviews}+
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800 group-hover:text-violet-700 transition line-clamp-2">{product.name}</h3>
                  <div className="flex items-center mt-1">
                    <p className="text-violet-700 font-bold text-sm">
                      {formatPrice(product.salePrice || product.price)}
                    </p>
                    {product.salePrice && product.salePrice < product.price && (
                      <p className="text-gray-400 text-xs line-through ml-2">{formatPrice(product.price)}</p>
                    )}
                  </div>
                  <div className="mt-1.5">
                    <button className="text-xs text-violet-600 hover:text-fuchsia-600 transition-colors font-medium flex items-center">
                      Xem chi tiết
                      <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-4 text-center text-gray-500 text-sm">
              Đang tải sản phẩm...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;