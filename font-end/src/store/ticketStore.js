import { create } from 'zustand';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/ticket`;
axios.defaults.withCredentials = true;

export const useTicketStore = create((set) => ({
    selectedSeats: [],
    totalPrice: 0,
    ticketInfo: null,
    loading: false,
    error: null,

    // Thêm ghế được chọn
    addSelectedSeat: (seat) => {
        set((state) => ({
            selectedSeats: [...state.selectedSeats, seat],
            totalPrice: state.totalPrice + seat.price
        }));
    },

    // Xóa ghế đã chọn
    removeSelectedSeat: (seatNumber) => {
        set((state) => ({
            selectedSeats: state.selectedSeats.filter(seat => seat.seatNumber !== seatNumber),
            totalPrice: state.totalPrice - state.selectedSeats.find(seat => seat.seatNumber === seatNumber).price
        }));
    },

    // Reset state
    resetSelection: () => {
        set({
            selectedSeats: [],
            totalPrice: 0,
            ticketInfo: null,
            error: null
        });
    },

    // Lưu thông tin screening
    setTicketInfo: (info) => {
        set({ ticketInfo: info });
    },

    // Tạo ticket tạm thời
    createTemporaryTicket: async (screeningId, userId, movieId, roomId, seatNumber) => {
        try {
            set({ loading: true, error: null });
            const response = await axios.post(`${API_URL}`, {
                screeningId,
                userId,
                movieId,
                roomId,
                seatNumber
            });
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || 'Error creating ticket'
            });
            throw error;
        }
    }
})); 