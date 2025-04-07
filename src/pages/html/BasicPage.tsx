import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BasicPageProps {
  title: string;
  breadcrumbName: string;
  children: React.ReactNode;
}

const BasicPage: React.FC<BasicPageProps> = ({ title, breadcrumbName, children }) => {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center text-sm backdrop-blur-sm bg-white/30 p-3 rounded-lg shadow-sm">
          <Link to="/" className="hover:text-violet-600 transition-colors flex items-center">
            <Home size={14} className="mr-1" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="font-medium text-violet-700">{breadcrumbName}</span>
        </div>
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 mb-4 drop-shadow-sm">{title}</h1>
        <div className="relative">
          <div className="h-1 w-24 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mx-auto"></div>
          <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mt-1 animate-pulse"></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-10 relative overflow-hidden backdrop-blur-md border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50 opacity-50"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-pink-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BasicPage; 