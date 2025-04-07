import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFlowerById, getFlowerByCode, getFlowerReviews, addFlowerReview, getAllFlowers } from '../../../firebase/services/productService';
import { Flower, ShoppingCart, ArrowLeft, Heart, Star, Box, Check, RefreshCw, Truck, Shield, Award, Share2, Send, MessageCircle, Clock } from 'lucide-react';
import BasicPage from '../BasicPage';
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
  code?: string;
  productCode?: string;
  [key: string]: any;
}

interface ReviewData {
  id?: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

const ProductDetailPage: React.FC = () => {
  const { id: productCode } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { isAuthenticated, userData } = authState;
  const [product, setProduct] = useState<FlowerProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');
  const [wishlist, setWishlist] = useState<string[]>([]);
  

  const [reviews, setReviews] = useState<Record<string, ReviewData>>({});
  const [newReview, setNewReview] = useState<{
    userName: string;
    rating: number;
    comment: string;
  }>({
    userName: userData?.displayName || '',
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  
  useEffect(() => {
    if (userData?.displayName) {
      setNewReview(prev => ({
        ...prev,
        userName: userData.displayName || ''
      }));
    }
  }, [userData]);
  
  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!productCode) {
        setError('Không tìm thấy sản phẩm');
        setLoading(false);
        return;
      }
      
      try {

        let cleanProductCode = productCode;
        if (productCode.includes('flowers=')) {
          cleanProductCode = productCode.split('flowers=')[1];
        }
        
        console.log("Tìm sản phẩm với mã:", cleanProductCode);
        
    
        const allFlowers = await getAllFlowers();
        console.log("Tất cả sản phẩm:", allFlowers);
        
        const productData = await getFlowerByCode(cleanProductCode);
        console.log("Kết quả tìm kiếm sản phẩm:", productData);
        
        if (productData) {
          setProduct(productData);
        } else {
   
          if (allFlowers) {
            let found = false;
            for (const [id, flower] of Object.entries(allFlowers)) {
              const flowerData = flower as any;
      
              if (
                id === cleanProductCode ||
                flowerData.code === cleanProductCode || 
                flowerData.productCode === cleanProductCode
              ) {
                console.log("Tìm thấy sản phẩm qua tìm kiếm trực tiếp:", flowerData);
                setProduct({
                  id,
                  ...flowerData
                });
                found = true;
                break;
              }
            }
            
            if (!found) {
              setError('Không tìm thấy sản phẩm với mã: ' + cleanProductCode);
            }
          } else {
            setError('Không tìm thấy sản phẩm');
          }
        }
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
        setError('Đã xảy ra lỗi khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetail();
  }, [productCode]);
  

  useEffect(() => {
    const fetchReviews = async () => {
      if (product?.id) {
        try {
          const reviewsData = await getFlowerReviews(product.id);
          if (reviewsData) {
            setReviews(reviewsData);
          }
        } catch (err) {
          console.error('Lỗi khi lấy đánh giá:', err);
        }
      }
    };
    
    if (product) {
      fetchReviews();
    }
  }, [product]);
  
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);
  

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
  

  const handleQuantityChange = (value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };
  
 
  const handleAddToCart = () => {
    if (!product) return;
    
 
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
  
    const existingCart = localStorage.getItem('cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];
    

    const finalPrice = product.salePrice || product.price;
    

    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
    
      cart[existingItemIndex].quantity += quantity;
    } else {
   
      cart.push({
        id: product.id,
        code: product.code || product.productCode,
        name: product.name,
        price: finalPrice,
        originalPrice: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity,
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
    alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
  };
  

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={`${i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };
  
 
  const getProductImages = (mainImage: string) => {

    return [
      mainImage,
      'https://images.unsplash.com/photo-1530092285049-1c42085fd395?q=80&w=500',
      'https://images.unsplash.com/photo-1615280825886-fa817c0a06cc?q=80&w=500',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJXlbLP6cYrGUL_tfItmIuioX0SoXxnPGq5A&s'
    ];
  };
  
  
 
  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };
  
 
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!product?.id || !newReview.comment.trim()) {
      alert('Vui lòng điền đầy đủ thông tin đánh giá!');
      return;
    }
    
    try {
      setSubmittingReview(true);
      
      const reviewData = {
        ...newReview,
        userName: userData?.displayName || 'Người dùng ẩn danh',
        createdAt: Date.now()
      };
      
      await addFlowerReview(product.id, reviewData);
      
    
      setReviewSuccess(true);
      
    
      setTimeout(() => {
        setNewReview({
          userName: userData?.displayName || '',
          rating: 5,
          comment: ''
        });
        setReviewSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Lỗi khi gửi đánh giá:', err);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau!');
    } finally {
      setSubmittingReview(false);
    }
  };
  

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

 
  const toggleWishlist = () => {
    if (!product) return;
    
   
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
  
  if (loading) {
    return (
      <BasicPage title="Chi tiết sản phẩm" breadcrumbName="Đang tải...">
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center py-20">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-violet-200 animate-spin border-t-violet-600"></div>
            <Flower size={20} className="text-violet-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </BasicPage>
    );
  }
  
  if (error || !product) {
    return (
      <BasicPage title="Không tìm thấy sản phẩm" breadcrumbName="Lỗi">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <Flower size={32} className="text-red-500" />
            </div>
            <p className="text-gray-600 mb-4">{error || 'Không tìm thấy thông tin sản phẩm'}</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Quay lại danh sách sản phẩm
            </button>
          </div>
        </div>
      </BasicPage>
    );
  }
  
  const productImages = getProductImages(product.imageUrl);
  
  return (
    <BasicPage title={product.name} breadcrumbName="Chi tiết sản phẩm">
      <div className="relative">
       
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-violet-600 hover:text-violet-800 transition-colors bg-violet-50 px-4 py-2 rounded-lg"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span>Quay lại danh sách sản phẩm</span>
          </Link>
        </div>
        
     
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       
          <div className="space-y-4">
     
            <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white h-[400px] lg:h-[500px] flex items-center justify-center">
              {productImages[activeImageIndex] ? (
                <img 
                  src={productImages[activeImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                  <Flower size={64} className="text-gray-300" />
                </div>
              )}
              
       
              {product.salePrice && product.salePrice < product.price && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-3 py-2 rounded-lg text-sm shadow-lg">
                  Giảm {calculateDiscount(product.price, product.salePrice)}%
                </div>
              )}
              
      
              <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                <Share2 size={18} className="text-gray-500" />
              </button>
            </div>
      
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                    activeImageIndex === index 
                      ? 'border-violet-500 shadow-md' 
                      : 'border-gray-200 hover:border-violet-300'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Ảnh ${index + 1} của ${product.name}`}
                    className="w-full h-full object-cover"
                  />
                  {activeImageIndex === index && (
                    <div className="absolute inset-0 border-2 border-violet-500 rounded-lg"></div>
                  )}
                </button>
              ))}
            </div>
     
            {product.tags && product.tags.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Tags:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 text-xs font-medium bg-violet-100 text-violet-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          

          <div className="bg-white rounded-xl border border-gray-100 p-6 lg:p-8 shadow-sm">
       
            <div className="mb-6">
              <div className="text-sm text-violet-600 font-medium mb-2">
                {product.category}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
          
              {product.rating && (
                <div className="flex items-center mb-1">
                  <div className="flex mr-2">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.rating} ({product.reviews || 0} đánh giá)
                  </span>
                </div>
              )}
            </div>
  
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-900">Giá:</h2>
              <div className="flex items-center gap-2 mt-1">
                {product.salePrice ? (
                  <>
                    <span className="text-2xl font-bold text-violet-600">{formatPrice(product.salePrice)}</span>
                    <span className="text-lg text-gray-500 line-through">{formatPrice(product.price)}</span>
                    {calculateDiscount(product.price, product.salePrice) && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                        -{calculateDiscount(product.price, product.salePrice)}%
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-2xl font-bold text-violet-600">{formatPrice(product.price)}</span>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <span 
                className={`inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-medium ${
                  product.inStock 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {product.inStock ? (
                  <>
                    <Check size={16} className="mr-1.5" />
                    Còn hàng - Giao ngay
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} className="mr-1.5" />
                    Tạm hết hàng
                  </>
                )}
              </span>
            </div>
            
            {/* Mô tả */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Award size={18} className="mr-2 text-violet-600" />
                Mô tả sản phẩm
              </h2>
              <div className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                {product.description}
              </div>
            </div>
            {product.inStock && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <span className="text-gray-700 mr-4 font-medium">Số lượng:</span>
                  <div className="flex items-center">
                    <button 
                      className="w-10 h-10 rounded-l-lg bg-violet-50 text-violet-700 hover:bg-violet-100 flex items-center justify-center border border-violet-200" 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <span className="text-xl font-medium">-</span>
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 1 && val <= 99) {
                          setQuantity(val);
                        }
                      }}
                      className="w-14 h-10 text-center border-t border-b border-violet-200 focus:outline-none text-gray-700" 
                    />
                    <button 
                      className="w-10 h-10 rounded-r-lg bg-violet-50 text-violet-700 hover:bg-violet-100 flex items-center justify-center border border-violet-200" 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 99}
                    >
                      <span className="text-xl font-medium">+</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-200 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Thêm vào giỏ hàng
                  </button>
                  
                  <button 
                    onClick={toggleWishlist}
                    className={`sm:flex-none py-3.5 px-6 border-2 rounded-xl flex items-center justify-center transition-colors ${
                      product.id && isInWishlist(product.id)
                        ? 'border-red-500 text-red-500 hover:bg-red-50'
                        : 'border-violet-600 text-violet-600 hover:bg-violet-50'
                    }`}
                  >
                    <Heart 
                      size={20} 
                      className={`mr-2 ${product.id && isInWishlist(product.id) ? 'fill-current' : ''}`} 
                    />
                    {product.id && isInWishlist(product.id) ? 'Đã yêu thích' : 'Yêu thích'}
                  </button>
                </div>
              </div>
            )}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Dịch vụ & Chính sách</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <Truck size={20} className="text-violet-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Giao hàng miễn phí</p>
                    <p className="text-sm text-gray-600">Với đơn hàng từ 500,000đ</p>
                  </div>
                </div>
                <div className="flex items-start p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <RefreshCw size={20} className="text-violet-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Đổi trả dễ dàng</p>
                    <p className="text-sm text-gray-600">Trong vòng 24h</p>
                  </div>
                </div>
                <div className="flex items-start p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <Shield size={20} className="text-violet-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Bảo đảm chất lượng</p>
                    <p className="text-sm text-gray-600">Hoa tươi mới mỗi ngày</p>
                  </div>
                </div>
                <div className="flex items-start p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <Box size={20} className="text-violet-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Đóng gói cẩn thận</p>
                    <p className="text-sm text-gray-600">An toàn cho mọi đơn hàng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="border-b border-gray-100">
            <div className="flex items-center">
              <button 
                className={`px-6 py-4 text-sm font-medium flex items-center ${activeTab === 'description' ? 'text-violet-700 border-b-2 border-violet-700' : 'text-gray-600 hover:text-violet-600'}`}
                onClick={() => setActiveTab('description')}
              >
                <Award size={18} className="mr-2" />
                Mô tả sản phẩm
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium flex items-center ${activeTab === 'reviews' ? 'text-violet-700 border-b-2 border-violet-700' : 'text-gray-600 hover:text-violet-600'}`}
                onClick={() => setActiveTab('reviews')}
              >
                <MessageCircle size={18} className="mr-2" />
                Đánh giá & Nhận xét
                {product.reviews ? <span className="ml-1 text-xs bg-violet-100 text-violet-700 rounded-full px-2 py-0.5">{product.reviews}</span> : null}
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium flex items-center ${activeTab === 'shipping' ? 'text-violet-700 border-b-2 border-violet-700' : 'text-gray-600 hover:text-violet-600'}`}
                onClick={() => setActiveTab('shipping')}
              >
                <Truck size={18} className="mr-2" />
                Vận chuyển & Bảo quản
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                
                {product.details && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.details.origin && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                          <Flower size={16} className="text-violet-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">Nguồn gốc</h3>
                          <p className="text-gray-600 text-sm">{product.details.origin}</p>
                        </div>
                      </div>
                    )}
                    
                    {product.details.freshness && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                          <Box size={16} className="text-violet-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">Độ tươi</h3>
                          <p className="text-gray-600 text-sm">{product.details.freshness}</p>
                        </div>
                      </div>
                    )}
                    
                    {product.details.packaging && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                          <Box size={16} className="text-violet-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">Đóng gói</h3>
                          <p className="text-gray-600 text-sm">{product.details.packaging}</p>
                        </div>
                      </div>
                    )}
                    
                    {product.details.lifespan && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                          <Clock size={16} className="text-violet-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">Thời gian bảo quản</h3>
                          <p className="text-gray-600 text-sm">{product.details.lifespan}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                {/* Tổng quan đánh giá */}
                <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="text-center mb-6 md:mb-0 md:mr-8">
                      <div className="text-5xl font-bold text-gray-800">{product.rating ? product.rating.toFixed(1) : '0.0'}</div>
                      <div className="flex justify-center my-2">
                        {renderStars(product.rating || 0)}
                      </div>
                      <div className="text-sm text-gray-500">{product.reviews || 0} đánh giá</div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Đánh giá của khách hàng</h3>
                      <div className="space-y-2">
                        {reviews && Object.keys(reviews).length > 0 ? (
                          Object.entries(reviews).map(([id, review]) => (
                            <div key={id} className="bg-white rounded-lg p-4 border border-gray-100">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-gray-800">{review.userName}</div>
                                  <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        size={14} 
                                        className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                    <span className="text-xs text-gray-500 ml-2">
                                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-600 mt-2">{review.comment}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6">
                            <MessageCircle size={32} className="text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Form gửi đánh giá */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Gửi đánh giá của bạn</h3>
                  
                  {reviewSuccess ? (
                    <div className="p-4 bg-green-50 text-green-800 rounded-lg">
                      <div className="flex items-center">
                        <Check size={20} className="mr-2" />
                        <span>Cảm ơn bạn đã gửi đánh giá!</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview}>
                      {/* Hiển thị tên người dùng đã đăng nhập thay vì trường nhập liệu */}
                      <div className="mb-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white mr-3">
                            {userData?.photoURL ? (
                              <img src={userData.photoURL} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                            ) : (
                              <span>{userData?.displayName?.charAt(0) || 'U'}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{userData?.displayName || 'Người dùng ẩn danh'}</div>
                            <div className="text-sm text-gray-500">{userData?.email || ''}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Đánh giá
                        </label>
                        <div className="flex items-center space-x-2">
                          {[...Array(5)].map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                              className={`w-8 h-8 rounded-full ${
                                i < newReview.rating 
                                  ? 'bg-yellow-400 text-white' 
                                  : 'bg-gray-100 text-gray-400'
                              } flex items-center justify-center transition-colors`}
                            >
                              <Star size={16} className={i < newReview.rating ? 'fill-current' : ''} />
                            </button>
                          ))}
                          <span className="text-sm text-gray-500 ml-2">
                            {newReview.rating}/5
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Nhận xét của bạn
                        </label>
                        <textarea
                          name="comment"
                          value={newReview.comment}
                          onChange={handleReviewChange}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                          required
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={submittingReview || !isAuthenticated}
                        className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center disabled:opacity-70"
                      >
                        {submittingReview ? (
                          <>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            <span>Đang gửi...</span>
                          </>
                        ) : !isAuthenticated ? (
                          <>
                            <span>Vui lòng đăng nhập để đánh giá</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} className="mr-2" />
                            <span>Gửi đánh giá</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'shipping' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin vận chuyển</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="text-violet-600 mr-2">•</div>
                    <p>Giao hàng nhanh trong vòng 2 giờ trong nội thành.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-violet-600 mr-2">•</div>
                    <p>Đóng gói cẩn thận, giữ nguyên vẹn hoa trong quá trình vận chuyển.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-violet-600 mr-2">•</div>
                    <p>Miễn phí giao hàng cho đơn hàng từ 500.000đ trong khu vực nội thành.</p>
                  </li>
                </ul>
                
                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-4">Hướng dẫn bảo quản</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="text-violet-600 mr-2">•</div>
                    <p>Đặt hoa ở nơi mát mẻ, tránh ánh nắng trực tiếp và nguồn nhiệt.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-violet-600 mr-2">•</div>
                    <p>Thay nước cho hoa mỗi 2 ngày một lần.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-violet-600 mr-2">•</div>
                    <p>Cắt bớt phần gốc của hoa một chút trước khi thay nước.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-violet-600 mr-2">•</div>
                    <p>Loại bỏ những cánh hoa đã héo để giữ cho bó hoa luôn tươi đẹp.</p>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </BasicPage>
  );
};

export default ProductDetailPage; 