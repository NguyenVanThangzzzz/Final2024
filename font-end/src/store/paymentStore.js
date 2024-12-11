import { create } from 'zustand';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/payment`;

export const usePaymentStore = create((set) => ({
    paymentStatus: null,
    orderDetails: null,
    paymentError: null,
    isLoading: false,

    checkPaymentStatus: async (sessionId) => {
        try {
            set({ isLoading: true });
            const response = await axios.get(`${API_URL}/success?session_id=${sessionId}`, {
                withCredentials: true
            });
            
            if (response.data.success) {
                set({ 
                    paymentStatus: 'success',
                    orderDetails: response.data.order,
                    paymentError: null
                });
            } else {
                set({ 
                    paymentStatus: 'error',
                    paymentError: response.data.message || 'Payment verification failed'
                });
            }
        } catch (error) {
            console.error('Payment status check failed:', error);
            set({ 
                paymentStatus: 'error',
                paymentError: error.response?.data?.message || 'Payment verification failed'
            });
        } finally {
            set({ isLoading: false });
        }
    },

    resetPaymentState: () => {
        set({
            paymentStatus: null,
            orderDetails: null,
            paymentError: null,
            isLoading: false
        });
    }
}));
