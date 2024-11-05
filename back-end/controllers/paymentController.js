import { stripe } from "../db/stripe.js";
import Order from "../models/order.js";
import Ticket from "../models/ticket.js";

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

    const order = await Order.findOne({ stripeSessionId: session_id });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === "paid") {
      order.status = "paid";
      order.paymentDate = new Date();
      await order.save();

      const ticket = await Ticket.findById(order.ticketId);
      if (ticket) {
        ticket.status = "confirmed";
        await ticket.save();
      }

      return res.status(200).json({
        message: "Thanh toán thành công",
        order,
      });
    }

    res.status(400).json({ message: "Thanh toán chưa hoàn tất" });
  } catch (error) {
    console.error("Error in checkoutSuccess:", error);
    res.status(500).json({
      message: "Lỗi khi xử lý thanh toán",
      error: error.message,
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
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Cập nhật trạng thái đơn hàng
      const order = await Order.findOne({ stripeSessionId: paymentIntent.id });
      if (order) {
        order.status = "paid";
        order.paymentDate = new Date();
        await order.save();

        const ticket = await Ticket.findById(order.ticketId);
        if (ticket) {
          ticket.status = "confirmed";
          await ticket.save();
        }
      }
      break;
    case "payment_intent.payment_failed":
      // Xử lý khi thanh toán thất bại
      break;
  }

  res.json({ received: true });
};
