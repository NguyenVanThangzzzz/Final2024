import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "~/store/authStore";

function CheckAuth({ children }) {
  const { 
    isAuthenticated, 
    isInitialized,
    setShowLoginModal 
  } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      setShowLoginModal(true);
      navigate('/', { 
        replace: true,
        state: { from: location } // Lưu lại trang người dùng đang cố truy cập
      });
    }
  }, [isInitialized, isAuthenticated, setShowLoginModal, navigate, location]);

  if (!isInitialized) {
    return null;
  }

  return isAuthenticated ? children : null;
}

export default CheckAuth;
