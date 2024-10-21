import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MovieManagementPage from "./pages/MovieManagementPage";
import SettingPage from "./pages/SettingPage";
import UserManagementPage from "./pages/UserManagementPage";
import { useAdminStore } from "./Store/adminStore";

function App() {
  const { user, checkingAuth, checkAuth } = useAdminStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative flex">
      {/* Background gradient */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(121,129,255,0.3)_0%,rgba(224,206,244,0.2)_45%,rgba(243,249,255,0.1)_100%)]" />
        </div>
      </div> */}

      {/* Hiển thị Sidebar và Navbar chỉ khi người dùng đã đăng nhập */}
      {user ? (
        <div className="flex flex-row w-full">
          <Sidebar className="w-64 fixed top-0 left-0 h-full" />{" "}
          {/* Đặt Sidebar với chiều rộng cố định */}
          <div className="flex-1 ml-64">
            {" "}
            {/* Đảm bảo phần nội dung chính không bị che bởi Sidebar */}
            <Navbar />
            <div className="pt-16 p-4">
              {" "}
              {/* Thêm pt-16 để tránh bị Navbar che */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="/settings" element={<SettingPage />} />
                <Route
                  path="/user-management"
                  element={<UserManagementPage />}
                />
                <Route
                  path="/movie-management"
                  element={<MovieManagementPage />}
                />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen w-full">
          {/* Đặt trang Login vào giữa */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;