import Ticket from "../models/ticket.js";
import Order from "../models/order.js";
import Screening from "../models/screening.js";
import { User } from "../models/User.js";
import stripe from "stripe";

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

        const screening = await Screening.findById(screeningId);
        if (!screening) {
            return res.status(404).json({
                message: "Không tìm thấy suất chiếu",
            });
        }

        const totalPrice = screening.price * seats.length;

        const newTicket = await Ticket.create({
            screeningId,
            userId,
            movieId,
            roomId,
            seatNumbers,
            totalPrice,
            status: "confirmed",
        });

        const newOrder = await Order.create({
            userId,
            ticketId: newTicket._id,
            totalAmount: totalPrice,
            status: "pending",
            paymentMethod: "stripe",
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
        const order = await Order.findOne({ ticketId: ticketId });

        if (!ticket || !order) {
            return res.status(404).json({
                message: "Không tìm thấy vé hoặc bạn không có quyền hủy vé này",
            });
        }

        if (ticket.status === "cancelled") {
            return res.status(400).json({
                message: "Vé này đã được hủy trước đó",
            });
        }

        if (order.status === "paid" && order.stripeSessionId) {
            try {
                const refund = await stripe.refunds.create({
                    payment_intent: order.stripeSessionId,
                });

                order.status = "refunded";
                order.refundDate = new Date();
                await order.save();
            } catch (refundError) {
                return res.status(500).json({
                    message: "Không thể hoàn tiền, vui lòng liên hệ admin",
                });
            }
        }

        ticket.status = "cancelled";
        order.status = "cancelled";
        order.cancellationDate = new Date();

        await ticket.save();
        await order.save();

        res.status(200).json({
            message: "Hủy vé thành công",
            ticket,
            order,
        });
    } catch (error) {
        res.status(500).json({
            message: "Đã có lỗi xảy ra khi hủy vé",
            error: error.message,
        });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ userId })
            .populate({
                path: 'ticketId',
                populate: [
                    {
                        path: 'movieId',
                        select: 'name image'
                    },
                    {
                        path: 'screeningId',
                        select: 'showTime price'
                    },
                    {
                        path: 'roomId',
                        select: 'name screenType',
                        populate: {
                            path: 'cinemaId',
                            select: 'name streetName'
                        }
                    }
                ]
            })
            .sort({ orderDate: -1 });

        res.status(200).json({
            success: true,
            orders: orders.map(order => ({
                _id: order._id,
                orderDate: order.orderDate,
                totalAmount: order.totalAmount,
                status: order.status,
                paymentMethod: order.paymentMethod,
                movie: {
                    name: order.ticketId.movieId.name,
                    image: order.ticketId.movieId.image
                },
                screening: {
                    showTime: order.ticketId.screeningId.showTime,
                    price: order.ticketId.screeningId.price
                },
                seats: order.ticketId.seatNumbers,
                cinema: {
                    name: order.ticketId.roomId.cinemaId.name,
                    streetName: order.ticketId.roomId.cinemaId.streetName
                },
                room: {
                    name: order.ticketId.roomId.name,
                    screenType: order.ticketId.roomId.screenType
                }
            }))
        });
    } catch (error) {
        console.error('Error in getUserOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user orders',
            error: error.message
        });
    }
};
