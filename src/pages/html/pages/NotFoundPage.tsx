import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import BasicPage from '../BasicPage';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <BasicPage title="Không tìm thấy trang" breadcrumbName="404">
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="max-w-lg">
          <div className="relative mb-8">
            <div className="text-9xl font-extrabold text-gray-100 select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">404</div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Trang không tồn tại</h1>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
            Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang chủ.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate(-1)} 
              className="px-6 py-3 rounded-full border border-violet-200 text-violet-700 hover:bg-violet-50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <ArrowLeft size={18} /> Quay lại
            </button>
            
            <button 
              onClick={() => navigate('/')} 
              className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Home size={18} /> Trang chủ
            </button>
          </div>
        </div>
      </div>
    </BasicPage>
  );
};

export default NotFoundPage; 