import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../api/api';
import { Edit, Trash2, Plus, Search, FileDown, Filter, Eye } from 'lucide-react';

interface Product {
  id: number;
  productCode: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  image: string;
  categoryId: number;
  stock: number;
  createdAt: string;
  bestSeller: boolean;
  featured: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

const ProductManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'name' | 'price' | 'date'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll()
        ]);
        
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

  useEffect(() => {
    let result = [...products];

    if (selectedCategoryId !== 'all') {
      result = result.filter(product => product.categoryId === parseInt(selectedCategoryId));
    }

    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(lowerCaseSearch) ||
          product.productCode.toLowerCase().includes(lowerCaseSearch)
      );
    }

    result.sort((a, b) => {
      if (sortOption === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortOption === 'price') {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return sortDirection === 'asc' ? priceA - priceB : priceB - priceA;
      } else {
        return sortDirection === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategoryId, sortOption, sortDirection]);

  const handleDeleteProduct = async (productId: number) => {
    if (confirmDelete === productId.toString()) {
      try {
        await productAPI.delete(productId.toString());
        setProducts(products.filter(product => product.id !== productId));
        setConfirmDelete(null);
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm');
      }
    } else {
      setConfirmDelete(productId.toString());
    }
  };

  const handleExport = () => {
    alert('Xuất danh sách sản phẩm thành công!');
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Không xác định';
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

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
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Quản lý sản phẩm</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExport}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FileDown size={18} className="mr-2" />
              Xuất Excel
            </button>
            
            <Link
              to="/admin/addproduct"
              className="flex items-center justify-center px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Thêm sản phẩm
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as 'name' | 'price' | 'date')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none"
            >
              <option value="name">Sắp xếp theo tên</option>
              <option value="price">Sắp xếp theo giá</option>
              <option value="date">Sắp xếp theo ngày tạo</option>
            </select>
            <button
              onClick={toggleSortDirection}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-gray-50 rounded-md p-8 text-center">
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tồn kho
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 rounded-lg overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.productCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{getCategoryName(product.categoryId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.discountPrice ? (
                          <>
                            <span className="text-red-600">{product.discountPrice.toLocaleString()}đ</span>
                            <span className="text-gray-400 line-through ml-2">{product.price.toLocaleString()}đ</span>
                          </>
                        ) : (
                          <span>{product.price.toLocaleString()}đ</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.stock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-3">
                        <Link
                          to={`/admin/editproduct/${product.id}`}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Sửa sản phẩm"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className={`p-1 ${
                            confirmDelete === product.id.toString()
                              ? 'text-red-600 bg-red-100 rounded-full'
                              : 'text-red-600 hover:text-red-900'
                          }`}
                          title={confirmDelete === product.id.toString() ? 'Nhấn để xác nhận xóa' : 'Xóa sản phẩm'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
