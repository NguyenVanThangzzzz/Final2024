import { Navigate } from "react-router-dom";
import { useAuthStore } from "~/store/authStore";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore(); // Kiểm tra xem người dùng đã đăng nhập hay chưa

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children; // Nếu đã đăng nhập, render nội dung bên trong
};

export default PrivateRoute;
