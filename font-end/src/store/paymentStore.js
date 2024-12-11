import { create } from 'zustand';
import axios from '~/utils/axios';

export const usePaymentStore = create((set) => ({
    paymentStatus: null,
    orderDetails: null,
    paymentError: null,
    isLoading: false,

    checkPaymentStatus: async (sessionId) => {
        try {
            set({ isLoading: true });
            const response = await axios.get(`/api/payment/success?session_id=${sessionId}`);
            
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
