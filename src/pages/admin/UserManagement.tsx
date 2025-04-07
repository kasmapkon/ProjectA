import React, { useState } from 'react';
import { Edit, Trash2, Plus, Search, User, Mail, Shield, Filter } from 'lucide-react';

interface UserData {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [users, setUsers] = useState<UserData[]>([
    {
      id: 1,
      username: 'admin',
      email: 'admin@violetwednesday.com',
      role: 'admin',
      createdAt: '2023-05-20',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=8B5CF6&color=fff',
    },
    {
      id: 2,
      username: 'huongnguyen',
      email: 'huong@gmail.com',
      role: 'user',
      createdAt: '2023-08-10',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Huong&background=8B5CF6&color=fff',
    },
    {
      id: 3,
      username: 'haiyen',
      email: 'yen@example.com',
      role: 'user',
      createdAt: '2023-09-15',
      status: 'inactive',
      avatar: 'https://ui-avatars.com/api/?name=Yen&background=8B5CF6&color=fff',
    },
    {
      id: 4,
      username: 'quangtuan',
      email: 'tuan@example.com',
      role: 'user',
      createdAt: '2023-10-05',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Tuan&background=8B5CF6&color=fff',
    },
    {
      id: 5,
      username: 'marketing',
      email: 'marketing@violetwednesday.com',
      role: 'admin',
      createdAt: '2023-07-12',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Marketing&background=8B5CF6&color=fff',
    },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = (userId: number) => {
    if (confirmDelete === userId) {
      setUsers(users.filter(user => user.id !== userId));
      setConfirmDelete(null);
    } else {
      setConfirmDelete(userId);
    }
  };

  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? {...user, status: user.status === 'active' ? 'inactive' : 'active'}
        : user
    ));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Quản lý tài khoản</h1>
          
          <button
            className="flex items-center justify-center px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Thêm tài khoản
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm tài khoản..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>


          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield size={18} className="text-gray-400" />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'user')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="user">Người dùng</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Đã khóa</option>
            </select>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="bg-gray-50 rounded-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <User size={48} className="text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg">Không tìm thấy tài khoản nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.username} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Người dùng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Sửa thông tin"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className={`p-1 ${
                            confirmDelete === user.id
                              ? 'text-red-600 bg-red-100 rounded-full'
                              : 'text-red-600 hover:text-red-900'
                          }`}
                          title={confirmDelete === user.id ? 'Nhấn để xác nhận xóa' : 'Xóa tài khoản'}
                          disabled={user.role === 'admin'}
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

export default UserManagement; 