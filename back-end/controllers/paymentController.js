import { stripe } from "../db/stripe.js";
import Order from "../models/order.js";
import Ticket from "../models/ticket.js";
import Screening from "../models/screening.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId)
            .populate({
                path: "ticketId",
                populate: [
                    {
                        path: "movieId",
                        select: "name image",
                    },
                    {
                        path: "screeningId",
                        select: "showTime",
                    },
                    {
                        path: "roomId",
                        select: "name screenType roomType",
                        populate: {
                            path: "cinemaId",
                            select: "name streetName",
                        },
                    },
                ],
            })
            .populate("userId", "name email");

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        const amountInCents = order.totalAmount * 100;

        if (amountInCents < 50) {
            return res.status(400).json({
                message: "Số tiền thanh toán quá nhỏ cho giao dịch quốc tế",
            });
        }

        const screeningTime = new Date(
            order.ticketId.screeningId.startTime
        ).toLocaleString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        const seatsList = order.ticketId.seatNumbers.join(", ");

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Vé xem phim: ${order.ticketId.movieId.name}`,
                            description: [
                                `🕒 Suất chiếu: ${order.ticketId.screeningId.showTime}\n`,
                                `🏢 Rạp: ${order.ticketId.roomId.cinemaId.name}\n`,
                                `📍 Địa chỉ: ${order.ticketId.roomId.cinemaId.streetName}\n`,
                                `🎦 Phòng: ${order.ticketId.roomId.name} (${order.ticketId.roomId.screenType})\n`,
                                `💺 Ghế: ${seatsList}\n`,
                                `👤 Khách hàng: ${order.userId.name}\n`,
                                `📧 Email: ${order.userId.email}\n`,
                                `💰 Giá vé: $${order.totalAmount.toFixed(2)}\n`,
                            ].join(""),
                            images: [order.ticketId.movieId.image],
                        },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
            metadata: {
                orderId: order._id.toString(),
                movieName: order.ticketId.movieId.name,
                seats: seatsList,
                customerName: order.userId.name,
                customerEmail: order.userId.email,
                amountUSD: amountInCents / 100,
            },
        });

        order.stripeSessionId = session.id;
        await order.save();

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error in createCheckoutSession:", error);
        res.status(500).json({
            message: "Lỗi khi tạo phiên thanh toán",
            error: error.message,
        });
    }
};

export const checkoutSuccess = async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ 
                success: false,
                message: "Thiếu session_id" 
            });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);
        const order = await Order.findOne({ stripeSessionId: session_id })
            .populate({
                path: 'ticketId',
                populate: [
                    { path: 'movieId', select: 'name' },
                    { path: 'screeningId', select: 'showTime' }
                ]
            });

        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: "Không tìm thấy đơn hàng" 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Thanh toán thành công",
            order: order
        });

    } catch (error) {
        console.error("Error in checkoutSuccess:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi xử lý thanh toán",
            error: error.message
        });
    }
};

export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        // Handle the event
        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object;
                
                try {
                    // Cập nhật trạng thái đơn hàng
                    const order = await Order.findOne({ 
                        stripeSessionId: session.id 
                    });

                    if (!order) {
                        console.log('Order not found for session:', session.id);
                        return res.status(200).json({ received: true });
                    }

                    if (order.status === 'paid') {
                        return res.status(200).json({ received: true });
                    }

                    order.status = "paid";
                    order.paymentDate = new Date();
                    await order.save();

                    // Cập nhật ticket
                    const ticket = await Ticket.findById(order.ticketId);
                    if (ticket) {
                        ticket.status = "confirmed";
                        await ticket.save();

                        // Cập nhật trạng thái ghế
                        await Screening.updateMany(
                            { _id: ticket.screeningId },
                            {
                                $set: {
                                    "seats.$[elem].status": "booked"
                                }
                            },
                            {
                                arrayFilters: [{ "elem.seatNumber": { $in: ticket.seatNumbers } }]
                            }
                        );
                    }
                } catch (error) {
                    console.error('Error processing webhook:', error);
                    // Vẫn trả về 200 để Stripe không gửi lại webhook
                    return res.status(200).json({ received: true });
                }
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

export const cancelPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        const ticket = await Ticket.findById(order.ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Không tìm thấy vé" });
        }

        // Cập nhật trạng thái ghế về available ngay lập tức
        await Screening.updateMany(
            { _id: ticket.screeningId },
            {
                $set: {
                    "seats.$[elem].status": "available"
                }
            },
            {
                arrayFilters: [{ "elem.seatNumber": { $in: ticket.seatNumbers } }]
            }
        );

        // Cập nhật trạng thái ticket và order
        ticket.status = "cancelled";
        order.status = "cancelled";
        order.cancellationDate = new Date();

        await ticket.save();
        await order.save();

        res.status(200).json({
            message: "Đã hủy thanh toán thành công",
            reason: "Người dùng đã hủy thanh toán"
        });
    } catch (error) {
        console.error("Error in cancelPayment:", error);
        res.status(500).json({
            message: "Lỗi khi hủy thanh toán",
            error: error.message
        });
    }
};
