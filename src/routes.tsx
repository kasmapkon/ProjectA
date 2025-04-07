import { createBrowserRouter, RouterProvider, isRouteErrorResponse, useRouteError, Outlet } from "react-router-dom";
import Login from "./screen/LoginScreen";
import SignUp from "./screen/SignUp";
import { Suspense } from "react";
import Dashboard from "./pages/admin/Dashboard";
import Cart from "./pages/html/Cart";
import ProductManagement from "./pages/admin/ProductManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import UserManagement from "./pages/admin/UserManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import Statistics from "./pages/admin/Statistics";
import About from "./pages/html/About";
import News from "./pages/html/News";
import Contact from "./pages/html/Contact";
import ProductListPage from "./pages/html/pages/ProductListPage";
import ProductDetailPage from "./pages/html/pages/ProductDetailPage";
import ImportData from "./pages/admin/ImportData";
import ImportCategoryData from "./pages/admin/ImportCategoryData";
import NotFoundPage from "./pages/html/pages/NotFoundPage";
import PrivacyPolicy from "./pages/html/pages/PrivacyPolicy";
import TermsOfService from "./pages/html/pages/TermsOfService";
import WishlistPage from './pages/html/pages/WishlistPage';
import OrderTrackingPage from "./pages/html/pages/OrderTracking/OrderTrackingPage";
import Header from "./pages/html/Header";
import Footer from "./pages/html/Footer";
import Sidebar from "./pages/html/Sidebar";

function MainLayout() {
  return (
    <div>
      <Header />
      <div className="container mx-auto flex flex-col md:flex-row gap-6 mt-6">
        <div className="w-full md:w-3/4">
          <Outlet />
        </div>
        <div className="w-full md:w-1/4">
          <Sidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function AuthLayout() {
  return (
    <div>
      <Header />
      <div className="container mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-9xl font-bold text-violet-600">404</h1>
            <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6">Không tìm thấy trang</h2>
            <p className="text-gray-600 mb-8">
              Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
            >
              Quay lại trang chủ
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-violet-600">{error.status}</h1>
          <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6">Đã xảy ra lỗi</h2>
          <p className="text-gray-600 mb-8">
            {error.statusText || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
          >
            Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-violet-600">Lỗi không xác định</h1>
        <p className="text-gray-600 my-6">
          Đã có lỗi xảy ra. Vui lòng thử lại sau.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
        >
          Quay lại trang chủ
        </a>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <ProductListPage /> },
      { path: "cart", element: <Cart /> },
      { path: "gioi-thieu", element: <About /> },
      { path: "tin-tuc", element: <News /> },
      { path: "lien-he", element: <Contact /> },
      
      { path: "products", element: <ProductListPage /> },
      { path: "products/category/:categorySlug", element: <ProductListPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      
      { path: "products/:categoryName", element: <ProductListPage /> },
      
      { path: "bao-mat", element: <PrivacyPolicy /> },
      { path: "dieu-khoan", element: <TermsOfService /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'don-hang', element: <OrderTrackingPage /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-600"></div>
      </div>}>
        <Dashboard />
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { path: "products", element: <ProductManagement /> },
      { path: "categories", element: <CategoryManagement /> },
      { path: "users", element: <UserManagement /> },
      { path: "orders", element: <OrderManagement /> },
      { path: "statistics", element: <Statistics /> },
      { path: "import-data", element: <ImportData /> },
      { path: "import-category-data", element: <ImportCategoryData /> },
      { index: true, element: <Statistics /> },
      
      { path: "*", element: <div className="p-8">
        <h1 className="text-2xl font-bold text-violet-600 mb-4">Trang không tồn tại</h1>
        <p className="text-gray-600 mb-4">Trang bạn đang tìm kiếm không có trong phần quản trị.</p>
        <a href="/admin" className="text-violet-600 hover:underline">Quay lại Dashboard</a>
      </div> }
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default router;
