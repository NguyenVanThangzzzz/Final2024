import { Navigate } from "react-router-dom";
import { useAuthStore } from "~/store/authStore";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore(); // Lấy thông tin xác thực

  if (!isAuthenticated) {
    // Nếu người dùng chưa đăng nhập, điều hướng đến trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    // Nếu người dùng chưa xác thực email, điều hướng đến trang xác thực email
    return <Navigate to="/verify-email" replace />;
  }

  return children; // Nếu người dùng đã xác thực, trả về các children
};

export default PrivateRoute;
