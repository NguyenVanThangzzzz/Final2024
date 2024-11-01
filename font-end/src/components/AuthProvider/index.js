import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '~/store/authStore';
import { publicRoutes } from '~/routes';

function AuthProvider({ children }) {
    const { checkAuth } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        // Kiểm tra xem route hiện tại có yêu cầu đăng nhập không
        const currentRoute = publicRoutes.find(route => route.path === location.pathname);
        const requiresAuth = currentRoute?.requireLogin;

        const initAuth = async () => {
            if (requiresAuth) {
                try {
                    await checkAuth();
                } catch (error) {
                    console.error('Initial auth check failed:', error);
                }
            }
        };

        initAuth();
    }, [checkAuth, location.pathname]);

    return children;
}

export default AuthProvider; 