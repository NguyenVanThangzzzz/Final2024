import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
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
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(121,129,255,0.3)_0%,rgba(224,206,244,0.2)_45%,rgba(243,249,255,0.1)_100%)]" />
        </div>
      </div>

      {/* Hiển thị Sidebar và Navbar chỉ khi người dùng đã đăng nhập */}
      {user ? (
        <div className="flex flex-row w-full">
          <Sidebar className="w-64 fixed" />{" "}
          {/* Đặt Sidebar với chiều rộng cố định */}
          <div className="flex-1 ml-64">
            {" "}
            {/* Phần nội dung chính bắt đầu từ sau Sidebar */}
            <Navbar />
            <div className="p-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Navigate to="/" />} />
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
