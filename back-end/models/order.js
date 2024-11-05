import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "cash",
    },
    orderDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    stripeSessionId: {
      type: String,
      required: false,
    },
    paymentDate: Date,
    refundDate: Date,
    cancellationDate: Date,
    notes: String,
  },

  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
