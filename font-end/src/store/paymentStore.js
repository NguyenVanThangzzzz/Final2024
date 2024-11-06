import axios from "axios";
import { create } from "zustand";

const API_URL = "http://localhost:8080/api/payment";
axios.defaults.withCredentials = true;

export const usePaymentStore = create((set) => ({
    paymentStatus: null,
    paymentError: null,
    orderDetails: null,
    cancelReason: null,

    checkPaymentStatus: async (sessionId) => {
        try {
            const response = await axios.get(`${API_URL}/success?session_id=${sessionId}`);

            // Kiểm tra và format dữ liệu từ response
            if (response.data.order) {
                const { order } = response.data;
                set({
                    paymentStatus: 'success',
                    orderDetails: {
                        _id: order._id,
                        totalAmount: order.totalAmount,
                        status: order.status,
                        paymentDate: order.paymentDate,
                        ticketId: {
                            movieId: {
                                name: order.ticketId.movieId.name,
                            },
                            seatNumbers: order.ticketId.seatNumbers,
                            screeningId: {
                                showTime: order.ticketId.screeningId.showTime,
                            },
                            roomId: {
                                name: order.ticketId.roomId.name,
                                screenType: order.ticketId.roomId.screenType,
                                cinemaId: {
                                    name: order.ticketId.roomId.cinemaId.name,
                                    streetName: order.ticketId.roomId.cinemaId.streetName,
                                },
                            },
                        },
                        userId: {
                            name: order.userId.name,
                            email: order.userId.email,
                        },
                    },
                    paymentError: null
                });
            } else {
                throw new Error('Không có dữ liệu đơn hàng');
            }

            return response.data;
        } catch (error) {
            set({
                paymentStatus: 'error',
                paymentError: error.response?.data?.message || 'Có lỗi xảy ra khi xác thực thanh toán',
                orderDetails: null
            });
            throw error;
        }
    },

    handlePaymentCancel: async (orderId) => {
        try {
            const response = await axios.post(`${API_URL}/cancel`, { orderId });

            set({
                paymentStatus: 'cancelled',
                cancelReason: response.data.reason || 'Thanh toán đã bị hủy',
                orderDetails: null,
                paymentError: null
            });

            return response.data;
        } catch (error) {
            set({
                paymentStatus: 'error',
                paymentError: error.response?.data?.message || 'Có lỗi xảy ra khi hủy thanh toán',
                orderDetails: null,
                cancelReason: null
            });
            throw error;
        }
    },

    // Reset state khi cần thiết
    resetPaymentState: () => {
        set({
            paymentStatus: null,
            paymentError: null,
            orderDetails: null,
            cancelReason: null
        });
    }
}));
