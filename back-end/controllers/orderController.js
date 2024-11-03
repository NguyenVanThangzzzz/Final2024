import Ticket from "../models/ticket.js";
import Order from "../models/order.js";
import Screening from "../models/screening.js";
import { User } from "../models/User.js";

export const createOrder = async (req, res) => {
    try {
        const { screeningId, seats, movieId, roomId } = req.body;
        const userId = req.user._id;

        const seatNumbers = seats.map(seat => seat.seatNumber);
        const existingTicket = await Ticket.findOne({
            screeningId,
            seatNumbers: { $in: seatNumbers },
            status: { $ne: "cancelled" },
        });

        if (existingTicket) {
            return res.status(400).json({
                message: "Một hoặc nhiều ghế đã được đặt cho suất chiếu này",
            });
        }

        const totalPrice = seats.reduce((sum, seat) => sum + seat.price, 0);

        const newTicket = await Ticket.create({
            screeningId,
            userId,
            movieId,
            roomId,
            seatNumbers,
            totalPrice,
            status: "pending",
        });

        const newOrder = await Order.create({
            userId,
            ticketId: newTicket._id,
            totalAmount: totalPrice,
            status: "pending",
            paymentMethod: "cash",
            orderDate: new Date()
        });

        await Screening.updateMany(
            { _id: screeningId },
            {
                $set: {
                    "seats.$[elem].status": "booked"
                }
            },
            {
                arrayFilters: [{ "elem.seatNumber": { $in: seatNumbers } }],
                new: true
            }
        );

        const populatedOrder = await Order.findById(newOrder._id)
            .populate({
                path: 'ticketId',
                populate: [
                    {
                        path: 'screeningId',
                        select: 'startTime'
                    },
                    {
                        path: 'movieId',
                        select: 'name poster'
                    },
                    {
                        path: 'roomId',
                        select: 'name screenType roomType',
                        populate: {
                            path: 'cinemaId',
                            select: 'name address'
                        }
                    }
                ]
            })
            .populate('userId', 'name email');

        res.status(201).json({
            message: "Đặt vé thành công",
            order: populatedOrder,
        });
    } catch (error) {
        console.error("Error in createOrder:", error);
        res.status(500).json({
            message: "Đã có lỗi xảy ra khi đặt vé",
            error: error.message,
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ userId })
            .populate({
                path: 'ticketId',
                populate: [
                    {
                        path: 'screeningId',
                        select: 'startTime'
                    },
                    {
                        path: 'movieId',
                        select: 'name poster'
                    },
                    {
                        path: 'roomId',
                        select: 'name screenType roomType',
                        populate: {
                            path: 'cinemaId',
                            select: 'name address'
                        }
                    }
                ]
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Lấy danh sách đơn hàng thành công",
            orders,
        });
    } catch (error) {
        console.error("Error in getMyOrders:", error);
        res.status(500).json({
            message: "Đã có lỗi xảy ra khi lấy danh sách đơn hàng",
            error: error.message,
        });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const userId = req.user._id;

        const ticket = await Ticket.findOne({ _id: ticketId, userId });

        if (!ticket) {
            return res.status(404).json({
                message: "Không tìm thấy vé hoặc bạn không có quyền hủy vé này",
            });
        }

        if (ticket.status === "cancelled") {
            return res.status(400).json({
                message: "Vé này đã được hủy trước đó",
            });
        }

        ticket.status = "cancelled";
        await ticket.save();

        res.status(200).json({
            message: "Hủy vé thành công",
            ticket,
        });
    } catch (error) {
        console.error("Error in cancelOrder:", error);
        res.status(500).json({
            message: "Đã có lỗi xảy ra khi hủy vé",
            error: error.message,
        });
    }
};
