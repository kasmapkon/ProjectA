import React, { useEffect, useState, useRef } from 'react';
import { listenToFlowers } from '../../../firebase/services/productService';
import { Flower, Search, Tag, ShoppingBag, Star, Filter, X, Check, Percent, Eye, ChevronRight, ChevronUp, ChevronLeft, Heart } from 'lucide-react';
import BasicPage from '../BasicPage';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface FlowerProduct {
  id?: string;
  name: string;
  price: number;
  salePrice?: number;
  description: string;
  imageUrl: string;
  category: string;  
  categoryName?: string; 
  categorySlug?: string; 
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  tags?: string[];
  [key: string]: any;
}

const createSlugFromCategory = (categoryName: string): string => {
  const slug = categoryName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  console.log(`Tạo slug từ tên danh mục: "${categoryName}" -> "${slug}"`);
  return slug;
};

const categorySlugMap: { [key: string]: string } = {
  'hoa-ky-niem': 'ky-niem',
  'hoa-kỉ-niem': 'ky-niem',
  'hoa-ki-niem': 'ky-niem',
  'hoa-qua-tang': 'qua-tang',
  'hoa-tinh-yeu': 'tinh-yeu',
  'hoa-bieu-tuong-cho-tinh-yeu': 'tinh-yeu',
  'hoa-trang-tri': 'trang-tri',
  'hoa-sinh-nhat': 'sinh-nhat',
  'hoa-cuoi': 'cuoi',
  'hoa-chuc-mung': 'chuc-mung'
};

const getCategoryIdFromSlug = (slug: string): string => {
  return categorySlugMap[slug] || slug;
};

const ProductListPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromQuery = searchParams.get('category');
  
  const [products, setProducts] = useState<Record<string, FlowerProduct> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [discountFilter, setDiscountFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  
  const [expandedSections, setExpandedSections] = useState({
    sort: false,
    price: false,
    discount: false,
    rating: false
  });
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 9;

  const [wishlist, setWishlist] = useState<string[]>([]);
  const { authState } = useAuth();
  const { isAuthenticated } = authState;

  const toggleSection = (section: 'sort' | 'price' | 'discount' | 'rating') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    console.log('Query parameter category:', categoryFromQuery);
    
    const unsubscribe = listenToFlowers((flowersData) => {
      console.log('Received products data:', flowersData);
      setProducts(flowersData);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [categoryFromQuery]);

  useEffect(() => {
    console.log('Processing category filter. Category from query:', categoryFromQuery);
    console.log('Current products:', products);
  
    if (products && categoryFromQuery) {
      console.log('Setting active filter to:', categoryFromQuery);

      if (Object.values(products).length > 0) {

        const categoryId = getCategoryIdFromSlug(categoryFromQuery);
        console.log('Resolved category ID from slug:', categoryId);
        
        const matchingProduct = Object.values(products).find(product => 
          product.category === categoryId || createSlugFromCategory(product.category) === categoryFromQuery
        );

        if (matchingProduct) {
          console.log('Found matching category:', matchingProduct.category);
          setActiveFilter(matchingProduct.category);
        } else {
          console.log('No matching category found for slug:', categoryFromQuery);
    
          setActiveFilter(categoryId);
        }
      }
    } else if (!categoryFromQuery) {
  
      console.log('Resetting active filter (no category in query)');
      setActiveFilter(null);
    }
  }, [categoryFromQuery, products]);


  const handleFilterByCategory = (categoryId: string | null) => {
    console.log('Filter by category:', categoryId);
    setActiveFilter(categoryId);
    
 
    if (categoryId) {
 
      const categorySlug = createSlugFromCategory(categoryId);
      navigate(`/products?category=${categorySlug}`, { replace: true });
    } else {
      navigate('/products', { replace: true });
    }
  };


  const getFilteredProducts = () => {
    if (!products) return [];
    
    let filteredProducts = Object.values(products);
    

    if (activeFilter) {
      filteredProducts = filteredProducts.filter(product => {
      
        const isMatch = 
          product.category === activeFilter || 
          product.categorySlug === categoryFromQuery ||
          (product.categoryName && product.categoryName.toLowerCase() === activeFilter.toLowerCase());
        
        if (isMatch) {
          console.log(`Lọc: Sản phẩm phù hợp - ${product.name}, danh mục: ${product.category}, slug: ${product.categorySlug}`);
        }
        
        return isMatch;
      });
    }
    

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTermLower)
      );
      console.log(`Tìm kiếm theo tên: "${searchTerm}" - Kết quả: ${filteredProducts.length} sản phẩm`);
    }
    

    if (priceRange) {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.salePrice || product.price;
        
        switch(priceRange) {
          case 'under-300':
            return price < 300000;
          case '300-500':
            return price >= 300000 && price <= 500000;
          case '500-800':
            return price > 500000 && price <= 800000;
          case '800-1000':
            return price > 800000 && price <= 1000000;
          case 'over-1000':
            return price > 1000000;
          default:
            return true;
        }
      });
    }
    

    if (discountFilter) {
      filteredProducts = filteredProducts.filter(product => {
    
        if (!product.salePrice || product.salePrice >= product.price) return false;
        
        const discount = Math.round(((product.price - product.salePrice) / product.price) * 100);
        
        switch(discountFilter) {
          case 'any-discount':
            return discount > 0;
          case 'at-least-10':
            return discount >= 10;
          case 'at-least-20':
            return discount >= 20;
          case 'at-least-30':
            return discount >= 30;
          case 'at-least-50':
            return discount >= 50;
          default:
          return true;
        }
      });
    }
    

    if (ratingFilter) {
      filteredProducts = filteredProducts.filter(product => {
        return product.rating && product.rating >= ratingFilter;
      });
    }
    

    if (sortBy) {
      switch(sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
          break;
        case 'rating-desc':
          filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'popular':
          filteredProducts.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
          break;
        case 'discount-desc':
          filteredProducts.sort((a, b) => {
            const discountA = a.salePrice ? ((a.price - a.salePrice) / a.price) * 100 : 0;
            const discountB = b.salePrice ? ((b.price - b.salePrice) / b.price) * 100 : 0;
            return discountB - discountA;
          });
          break;
      }
    }
    
    return filteredProducts;
  };


  const getCurrentPageProducts = () => {
    const filtered = getFilteredProducts();
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filtered.slice(indexOfFirstProduct, indexOfLastProduct);
  };


  const totalPages = Math.ceil(getFilteredProducts().length / productsPerPage);


  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);

    window.scrollTo({
      top: document.getElementById('product-list-container')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };


  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm, priceRange, discountFilter, ratingFilter, sortBy]);


  const categories = products
    ? [...new Set(Object.values(products).map(product => product.category))]
    : [];

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

  const handleAddToCart = (product: FlowerProduct) => {

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

  useEffect(() => {
   
    const searchFromQuery = searchParams.get('search');
    if (searchFromQuery) {
      console.log('Search term from URL:', searchFromQuery);
      setSearchTerm(searchFromQuery);
      document.title = `Tìm kiếm: ${searchFromQuery} | Violet on Wednesday`;
    }
  }, [searchParams]);


  const resetAllFilters = () => {
    setSearchTerm('');
    setActiveFilter(null);
    setPriceRange(null);
    setDiscountFilter(null);
    setRatingFilter(null);
    setSortBy(null);
    navigate('/products', { replace: true });
  };

 
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  const toggleWishlist = (product: FlowerProduct) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const productId = product.id || '';
    let updatedWishlist: string[];
    
    if (wishlist.includes(productId)) {
      updatedWishlist = wishlist.filter(id => id !== productId);
  
      alert(`Đã xóa ${product.name} khỏi danh sách yêu thích!`);
    } else {
  
      updatedWishlist = [...wishlist, productId];
  
      alert(`Đã thêm ${product.name} vào danh sách yêu thích!`);
    }
    

    setWishlist(updatedWishlist);
    

    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
 
    window.dispatchEvent(new Event('wishlistUpdated'));
  };


  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return (
    <BasicPage 
      title="Bộ Sưu Tập Hoa Tươi" 
      breadcrumbName="Sản phẩm"
    >
      <div className="relative">
     
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 relative z-10">
          <div className="flex items-center mb-6 lg:mb-0">
            <div className="relative mr-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-400/30 to-fuchsia-400/30 rounded-full blur-sm"></div>
              <div className="relative p-3 rounded-full bg-white border border-violet-100 shadow-sm text-violet-600">
                <ShoppingBag size={22} className="text-gradient-violet-fuchsia" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                  Bộ sưu tập hoa tươi
                </span>
              </h1>
              <p className="text-gray-500 text-sm">
                {getFilteredProducts().length} sản phẩm{' '}
                {activeFilter ? `trong danh mục ${activeFilter}` : ''}
              </p>
            </div>
          </div>
          
  
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button 
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="flex items-center justify-center py-2.5 px-4 bg-white border border-gray-100 text-gray-700 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} className="mr-2 text-violet-500" />
              <span className="text-sm">Bộ lọc</span>
            </button>
          </div>
        </div>
        

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-fadeIn">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

      
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
       
          <div className={`${
            isFilterVisible ? 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-end transition-opacity duration-300 ease-in-out' : 'hidden lg:block'
          }`}>
            <div className={`
              bg-white transition-all duration-300 ease-in-out
              ${isFilterVisible 
                ? 'w-full sm:w-80 h-full animate-in slide-in-from-right duration-300 shadow-xl' 
                : 'w-full rounded-xl border border-gray-100 p-5 shadow-sm'}
            `}>
              {isFilterVisible && (
                <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                  <h3 className="font-semibold text-gray-800">Lọc sản phẩm</h3>
                  <button 
                    onClick={() => setIsFilterVisible(false)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              
              <div className={isFilterVisible ? 'p-4' : ''}>
            
                <div className="mb-6">
                  <h3 
                    className="font-medium text-gray-700 mb-3 text-sm flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('sort')}
                  >
                    <div className="flex items-center">
                      <Filter size={16} className="mr-2 text-violet-500" />
                      Sắp xếp
                    </div>
                    <ChevronRight 
                      size={16} 
                      className={`text-gray-400 transition-transform duration-200 ${expandedSections.sort ? 'rotate-90' : ''}`}
                    />
                  </h3>
                  <div className={`space-y-1.5 transition-all duration-300 overflow-hidden ${expandedSections.sort ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <button
                      onClick={() => setSortBy(null)}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        sortBy === null
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Mặc định
                      </span>
                      {sortBy === null && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setSortBy('price-asc')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        sortBy === 'price-asc'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Giá tăng dần
                      </span>
                      {sortBy === 'price-asc' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setSortBy('price-desc')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        sortBy === 'price-desc'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Giá giảm dần
                      </span>
                      {sortBy === 'price-desc' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setSortBy('rating-desc')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        sortBy === 'rating-desc'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Đánh giá cao nhất
                      </span>
                      {sortBy === 'rating-desc' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setSortBy('popular')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        sortBy === 'popular'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Phổ biến nhất
                      </span>
                      {sortBy === 'popular' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setSortBy('discount-desc')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        sortBy === 'discount-desc'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Giảm giá nhiều nhất
                      </span>
                      {sortBy === 'discount-desc' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                  </div>
                </div>
                
          
                <div className="mb-6">
                  <h3 
                    className="font-medium text-gray-700 mb-3 text-sm flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('price')}
                  >
                    <div className="flex items-center">
                      <Tag size={16} className="mr-2 text-violet-500" />
                      Khoảng giá
                    </div>
                    <ChevronRight 
                      size={16} 
                      className={`text-gray-400 transition-transform duration-200 ${expandedSections.price ? 'rotate-90' : ''}`}
                    />
                  </h3>
                  <div className={`space-y-1.5 transition-all duration-300 overflow-hidden ${expandedSections.price ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <button
                      onClick={() => setPriceRange(null)}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        priceRange === null
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Tất cả giá
                      </span>
                      {priceRange === null && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setPriceRange('under-300')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        priceRange === 'under-300'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Dưới 300.000đ
                      </span>
                      {priceRange === 'under-300' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setPriceRange('300-500')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        priceRange === '300-500'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        300.000đ - 500.000đ
                      </span>
                      {priceRange === '300-500' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setPriceRange('500-800')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        priceRange === '500-800'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        500.000đ - 800.000đ
                      </span>
                      {priceRange === '500-800' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setPriceRange('800-1000')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        priceRange === '800-1000'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        800.000đ - 1.000.000đ
                      </span>
                      {priceRange === '800-1000' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setPriceRange('over-1000')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        priceRange === 'over-1000'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Trên 1.000.000đ
                      </span>
                      {priceRange === 'over-1000' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                  </div>
                </div>
                
         
                <div className="mb-6">
                  <h3 
                    className="font-medium text-gray-700 mb-3 text-sm flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('discount')}
                  >
                    <div className="flex items-center">
                      <Percent size={16} className="mr-2 text-violet-500" />
                      Giảm giá
                    </div>
                    <ChevronRight 
                      size={16} 
                      className={`text-gray-400 transition-transform duration-200 ${expandedSections.discount ? 'rotate-90' : ''}`}
                    />
                  </h3>
                  <div className={`space-y-1.5 transition-all duration-300 overflow-hidden ${expandedSections.discount ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <button
                      onClick={() => setDiscountFilter(null)}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        discountFilter === null
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Tất cả sản phẩm
                      </span>
                      {discountFilter === null && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setDiscountFilter('any-discount')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        discountFilter === 'any-discount'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Có giảm giá
                      </span>
                      {discountFilter === 'any-discount' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setDiscountFilter('at-least-10')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        discountFilter === 'at-least-10'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Giảm ít nhất 10%
                      </span>
                      {discountFilter === 'at-least-10' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setDiscountFilter('at-least-20')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        discountFilter === 'at-least-20'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Giảm ít nhất 20%
                      </span>
                      {discountFilter === 'at-least-20' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setDiscountFilter('at-least-30')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        discountFilter === 'at-least-30'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Giảm ít nhất 30%
                      </span>
                      {discountFilter === 'at-least-30' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setDiscountFilter('at-least-50')}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        discountFilter === 'at-least-50'
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Giảm ít nhất 50%
                      </span>
                      {discountFilter === 'at-least-50' && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                  </div>
                </div>
                
          
                <div className="mb-6">
                  <h3 
                    className="font-medium text-gray-700 mb-3 text-sm flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('rating')}
                  >
                    <div className="flex items-center">
                      <Star size={16} className="mr-2 text-violet-500" />
                      Đánh giá
                    </div>
                    <ChevronRight 
                      size={16} 
                      className={`text-gray-400 transition-transform duration-200 ${expandedSections.rating ? 'rotate-90' : ''}`}
                    />
                  </h3>
                  <div className={`space-y-1.5 transition-all duration-300 overflow-hidden ${expandedSections.rating ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <button
                      onClick={() => setRatingFilter(null)}
                      className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                        ratingFilter === null
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm transition-colors`}
                    >
                      <span className="flex items-center">
                        Tất cả đánh giá
                      </span>
                      {ratingFilter === null && (
                        <Check size={16} className="text-violet-500" />
                      )}
                    </button>
                    
                    {[4, 3, 2, 1].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setRatingFilter(rating)}
                        className={`w-full text-left px-3.5 py-2 rounded-lg flex items-center justify-between ${
                          ratingFilter === rating
                            ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        } text-sm transition-colors`}
                      >
                        <span className="flex items-center">
                          <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                              />
                            ))}
                          </div>
                          {rating} sao trở lên
                        </span>
                        {ratingFilter === rating && (
                          <Check size={16} className="text-violet-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
           
                <div className="mt-6 border-t border-gray-100 pt-4 px-2">
                  <button 
                    onClick={resetAllFilters}
                    className="w-full py-2.5 border border-violet-500 text-violet-600 hover:bg-violet-50 rounded-lg font-medium transition-all mb-3"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                
             
                {isFilterVisible && (
                    <button 
                      onClick={() => setIsFilterVisible(false)}
                      className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-lg font-medium hover:shadow-md transition-all"
                    >
                      Áp dụng
                    </button>
                  )}
                  </div>
              </div>
            </div>
          </div>
          
     
          <div className="lg:col-span-3" id="product-list-container">
     
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-violet-200 animate-spin border-t-violet-600"></div>
                  <Flower size={20} className="text-violet-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            ) : getFilteredProducts().length > 0 ? (
              <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCurrentPageProducts().map((product) => (
                  <div 
                      key={product.id} 
                      className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-violet-100 transition-all duration-300 group transform hover:-translate-y-1"
                  >
                    <div className="relative h-60 overflow-hidden">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Flower size={48} className="text-gray-300" />
                        </div>
                      )}
                      
                  
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center">
                          <div className="flex gap-2 pb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Link
                              to={`/product/${product.code || product.productCode || product.id}`}
                              className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-violet-600 shadow-md hover:bg-violet-50 transition-colors"
                        >
                              <Eye size={18} />
                        </Link>
                            <button
                              onClick={() => toggleWishlist(product)}
                              className={`flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md transition-colors ${
                                isInWishlist(product.id || '')
                                  ? 'text-red-500 hover:bg-red-50'
                                  : 'text-gray-400 hover:bg-gray-50 hover:text-red-500'
                              }`}
                            >
                              <Heart size={18} className={isInWishlist(product.id || '') ? 'fill-current' : ''} />
                            </button>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-fuchsia-500 shadow-md hover:bg-fuchsia-50 transition-colors"
                            >
                              <ShoppingBag size={18} />
                            </button>
                          </div>
                      </div>
                      
         
                      {product.salePrice && product.salePrice < product.price && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white text-xs font-medium py-1.5 px-3 rounded-full shadow-sm flex items-center">
                            <Percent size={12} className="mr-1.5" />
                          -{calculateDiscount(product.price, product.salePrice)}%
                        </div>
                      )}
                        
                  
                        {isInWishlist(product.id || '') && (
                          <div className="absolute top-3 right-3 bg-red-50 p-1.5 rounded-full shadow-sm">
                            <Heart size={14} className="text-red-500 fill-current" />
                    </div>
                        )}
                      </div>
                      
                      <div className="p-5">
              
                        {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {product.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                        </div>
                        )}
                        
                        <h3 className="font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-violet-600 transition-colors text-sm md:text-base">
                          {product.name}
                        </h3>
                      
            
                      {product.rating && (
                          <div className="flex items-center mb-3">
                            <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                  className={`${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                              />
                            ))}
                          </div>
                            {product.reviews && (
                              <span className="ml-2 text-xs text-gray-500">
                                ({product.reviews})
                          </span>
                            )}
                        </div>
                      )}
          
                        <div className="mt-3 flex items-baseline">
                        {product.salePrice ? (
                          <>
                              <span className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                                {formatPrice(product.salePrice)}
                              </span>
                              <span className="text-sm text-gray-400 line-through ml-2">
                                {formatPrice(product.price)}
                              </span>
                          </>
                        ) : (
                            <span className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        
                        <Link
                          to={`/product/${product.code || product.productCode || product.id}`}
                          className="mt-4 w-full py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-lg font-medium flex items-center justify-center hover:shadow-md transition-all text-sm"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                
  
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex space-x-1">
    
                      <button
                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 rounded-md ${
                          currentPage === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white border border-violet-200 text-violet-600 hover:bg-violet-50'
                        } transition-colors`}
                        aria-label="Trang trước"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
          
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNumber = index + 1;
                        
                     
                        if (
                          pageNumber === 1 || 
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => paginate(pageNumber)}
                              className={`min-w-[40px] px-3.5 py-1.5 rounded-md font-medium ${
                                currentPage === pageNumber
                                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white'
                                  : 'bg-white border border-violet-200 text-gray-700 hover:bg-violet-50'
                              } transition-colors`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        
            
                        if (
                          (pageNumber === currentPage - 2 && currentPage > 3) ||
                          (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <span key={pageNumber} className="flex items-center justify-center w-10">
                              ...
                            </span>
                          );
                        }
                        
                        return null;
                      })}
                      
         
                      <button
                        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1.5 rounded-md ${
                          currentPage === totalPages 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white border border-violet-200 text-violet-600 hover:bg-violet-50'
                        } transition-colors`}
                        aria-label="Trang tiếp theo"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 mb-4">
                  <Flower size={32} className="text-violet-500" />
                </div>
                <p className="text-gray-600 mb-4">Không tìm thấy sản phẩm nào phù hợp.</p>
                <button
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-lg hover:shadow-md transition-all"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    
      <button
        onClick={scrollToTop}
        className={`fixed right-6 bottom-6 z-50 p-3 rounded-full shadow-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white transform transition-all duration-300 hover:shadow-xl hover:scale-110 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Cuộn lên đầu trang"
      >
        <ChevronUp size={24} />
      </button>
    </BasicPage>
  );
};

export default ProductListPage; 