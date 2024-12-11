import axios from "axios";
import { create } from "zustand";
import { toast } from 'react-toastify';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/order`;
axios.defaults.withCredentials = true;

export const useOrderStore = create((set) => ({
    orders: [],
    loading: false,
    error: null,

    fetchMyOrders: async () => {
        set({ loading: true });
        try {
            const response = await axios.get(`${API_URL}/my-orders`, {
                withCredentials: true
            });
            set({ 
                orders: response.data.orders,
                loading: false,
                error: null
            });
            return response.data;
        } catch (error) {
            set({ 
                loading: false,
                error: error.response?.data?.message || 'Failed to fetch orders'
            });
            throw error;
        }
    },

    // Tạo order mới
    createOrder: async (orderData) => {
        try {
            set({ loading: true, error: null });
            const formattedData = {
                screeningId: orderData.screeningId,
                seats: orderData.seats.map(seat => ({
                    seatNumber: seat.seatNumber,
                    price: Number(seat.price)
                })),
                movieId: orderData.movieId,
                roomId: orderData.roomId
            };

            const response = await axios.post(`${API_URL}/create`, formattedData);
            set({
                loading: false,
                orderDetails: response.data.order
            });
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || 'Lỗi khi tạo đơn hàng'
            });
            throw error;
        }
    },

    // Hủy order
    cancelOrder: async (ticketId) => {
        try {
            set({ loading: true, error: null });
            const response = await axios.put(`${API_URL}/cancel/${ticketId}`);
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || 'Lỗi khi hủy đơn hàng'
            });
            throw error;
        }
    },

    // Reset state
    resetOrder: () => {
        set({
            orderDetails: null,
            loading: false,
            error: null
        });
    },

    // Thêm function mới để lấy lịch sử đơn hàng
    fetchUserOrders: async () => {
        set({ loading: true });
        try {
            const response = await axios.get(`${API_URL}/user-orders`);
            set({ 
                orders: response.data.orders,
                loading: false,
                error: null
            });
            return response.data.orders;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch orders';
            set({ 
                loading: false,
                error: errorMessage,
                orders: []
            });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Reset state
    resetOrders: () => {
        set({
            orders: [],
            loading: false,
            error: null
        });
    }
}));
