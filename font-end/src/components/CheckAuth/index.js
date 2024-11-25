import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "~/components/LoadingSpinner";
import { useAuthStore } from "~/store/authStore";

function CheckAuth({ children }) {
  const { 
    isAuthenticated, 
    isCheckingAuth, 
    checkAuth, 
    setShowLoginModal
  } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsInitialCheck(false);
      }
    };
    verifyAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated && !isInitialCheck) {
      setShowLoginModal(true);
      navigate('/', { replace: true });
    }
  }, [isCheckingAuth, isAuthenticated, setShowLoginModal, navigate, isInitialCheck]);

  if (isCheckingAuth || isInitialCheck) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : null;
}

export default CheckAuth;
