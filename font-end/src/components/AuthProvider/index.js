import { useEffect } from 'react';
import { useAuthStore } from '~/store/authStore';

function AuthProvider({ children }) {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            try {
                await checkAuth();
            } catch (error) {
                console.error('Initial auth check failed:', error);
            }
        };
        initAuth();
    }, [checkAuth]);

    return children;
}

export default AuthProvider; 