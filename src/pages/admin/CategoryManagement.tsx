import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, Tag, Upload, FileJson } from 'lucide-react';
import { getAllCategories, listenToCategories } from '../../firebase/services/productService';
import { deleteData } from '../../firebase/services/database';

interface Category {
  id: string;
  name: string;
  displayName: string;
  description: string;
  slug: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await getAllCategories();
        if (categoriesData) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu danh mục:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();

    const unsubscribe = listenToCategories((categoriesData) => {
      if (categoriesData) {
        setCategories(categoriesData);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleDeleteCategory = async (categoryKey: string) => {
    if (confirmDelete === categoryKey) {
      try {
        await deleteData(`categories/${categoryKey}`);
        setConfirmDelete(null);
      } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        alert('Có lỗi xảy ra khi xóa danh mục');
      }
    } else {
      setConfirmDelete(categoryKey);
    }
  };

  const filteredCategories = Object.entries(categories).filter(([key, category]) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Quản lý danh mục</h1>
          
          <div className="flex space-x-3">
            <Link
              to="/admin/importcategory"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FileJson size={18} className="mr-2" />
              Nhập dữ liệu JSON
            </Link>
            <Link
              to="/admin/addcategory"
              className="flex items-center justify-center px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Thêm danh mục
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="bg-gray-50 rounded-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <Tag size={48} className="text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg">Không tìm thấy danh mục nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên hiển thị
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCategories.map(([key, category]) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{key}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Tag size={16} className="text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{category.displayName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{category.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{category.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-3">
                        <Link
                          to={`/admin/editcategory/${key}`}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Sửa danh mục"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(key)}
                          className={`p-1 ${
                            confirmDelete === key
                              ? 'text-red-600 bg-red-100 rounded-full'
                              : 'text-red-600 hover:text-red-900'
                          }`}
                          title={confirmDelete === key ? 'Nhấn để xác nhận xóa' : 'Xóa danh mục'}
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

export default CategoryManagement;
