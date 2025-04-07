import React, { useEffect, useState } from 'react';
import { Heart, Trash2, ShoppingBag, Eye, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BasicPage from '../BasicPage';
import { listenToFlowers } from '../../../firebase/services/productService';
import { useAuth } from '../../../context/AuthContext';

interface FlowerProduct {
  id?: string;
  name: string;
  price: number;
  salePrice?: number;
  description: string;
  imageUrl: string;
  code?: string;
  productCode?: string;
  category: string;
  categoryName?: string;
  categorySlug?: string;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  tags?: string[];
  [key: string]: any;
}

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<FlowerProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [allProducts, setAllProducts] = useState<Record<string, FlowerProduct> | null>(null);
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { isAuthenticated } = authState;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const unsubscribe = listenToFlowers((flowersData) => {
      setAllProducts(flowersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  useEffect(() => {
    if (allProducts) {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const wishlistIds = JSON.parse(savedWishlist) as string[];
        const items = wishlistIds
          .map(id => allProducts[id])
          .filter(product => product !== undefined);
        
        setWishlistItems(items);
      }
    }
  }, [allProducts]);

  const removeFromWishlist = (productId: string) => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      const wishlistIds = JSON.parse(savedWishlist) as string[];
      const updatedWishlist = wishlistIds.filter(id => id !== productId);
      
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      
      window.dispatchEvent(new Event('wishlistUpdated'));

      alert('Đã xóa sản phẩm khỏi danh sách yêu thích!');
    }
  };

  const addToCart = (product: FlowerProduct) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const existingCart = localStorage.getItem('cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];
    
    const finalPrice = product.salePrice || product.price;
    
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        code: product.code || product.productCode,
        name: product.name,
        price: finalPrice,
        originalPrice: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
        category: product.category,
        categoryName: product.categoryName,
        categorySlug: product.categorySlug,
        description: product.description,
        inStock: product.inStock,
        rating: product.rating,
        reviews: product.reviews,
        tags: product.tags
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    window.dispatchEvent(new Event('cartUpdated'));
    
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateDiscount = (price: number, salePrice: number) => {
    if (!salePrice || salePrice >= price) return null;
    const discount = Math.round(((price - salePrice) / price) * 100);
    return discount;
  };

  return (
    <BasicPage 
      title="Danh sách yêu thích" 
      breadcrumbName="Yêu thích"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10">
          <div className="flex items-center mb-6 lg:mb-0">
            <div className="relative mr-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-400/30 to-pink-400/30 rounded-full blur-sm"></div>
              <div className="relative p-3 rounded-full bg-white border border-red-100 shadow-sm text-red-500">
                <Heart size={22} className="fill-current" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  Danh sách yêu thích
                </span>
              </h1>
              <p className="text-gray-500 text-sm">
                {wishlistItems.length} sản phẩm
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/products')}
              className="px-5 py-2.5 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-medium"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-red-200 animate-spin border-t-red-500"></div>
          </div>
        ) : wishlistItems.length > 0 ? (
          <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6">
                {wishlistItems.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-50 rounded-lg overflow-hidden mb-4 sm:mb-0 sm:mr-6">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <Link 
                        to={`/product/${product.code || product.productCode || product.id}`}
                        className="text-base font-medium text-gray-800 hover:text-violet-600 transition-colors line-clamp-2"
                      >
                        {product.name}
                      </Link>
                      
                      <div className="mt-2 flex items-center">
                        {product.salePrice && product.salePrice < product.price ? (
                          <>
                            <span className="text-lg font-semibold text-red-600">
                              {formatPrice(product.salePrice)}
                            </span>
                            <span className="text-sm text-gray-400 line-through ml-2">
                              {formatPrice(product.price)}
                            </span>
                            <span className="ml-3 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              -{calculateDiscount(product.price, product.salePrice)}%
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-semibold text-gray-700">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-4 flex space-x-3">
                        <Link 
                          to={`/product/${product.code || product.productCode || product.id}`}
                          className="flex items-center text-sm text-violet-600 hover:text-violet-700 transition-colors font-medium"
                        >
                          <Eye size={16} className="mr-1" />
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 sm:ml-6 flex space-x-3">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex items-center text-sm text-violet-600 hover:text-violet-700 transition-colors font-medium"
                      >
                        <ShoppingBag size={16} className="mr-1" />
                        Thêm vào giỏ
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id!)}
                        className="flex items-center text-sm text-red-600 hover:text-red-700 transition-colors font-medium"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-400/30 to-pink-400/30 rounded-full blur-sm"></div>
                <div className="relative p-4 rounded-full bg-white border border-red-100 shadow-sm text-red-500">
                  <Heart size={32} className="fill-current" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Danh sách yêu thích trống
              </h3>
              <p className="text-gray-500 mb-6">
                Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy thêm sản phẩm vào danh sách để dễ dàng theo dõi và mua sắm sau này.
              </p>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-full font-medium transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40"
              >
                Khám phá sản phẩm
              </button>
            </div>
          </div>
        )}
      </div>
    </BasicPage>
  );
};

export default WishlistPage; 