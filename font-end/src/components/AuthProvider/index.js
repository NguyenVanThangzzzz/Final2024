import { useEffect } from 'react';
import { useAuthStore } from '~/store/authStore';
import LoadingSpinner from '~/components/LoadingSpinner';

function AuthProvider({ children }) {
    const { checkAuth, isInitialized, isCheckingAuth } = useAuthStore();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await checkAuth();
            } catch (error) {
                console.error('Initial auth check failed:', error);
            }
        };

        if (!isInitialized) {
            initializeAuth();
        }
    }, [checkAuth, isInitialized]);

    if (!isInitialized || isCheckingAuth) {
        return <LoadingSpinner />;
    }

    return children;
}

export default AuthProvider; 