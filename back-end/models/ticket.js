import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    screeningId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screening",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    seatNumber: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// Đảm bảo mỗi ghế chỉ được đặt một lần cho mỗi buổi chiếu
ticketSchema.index({ screeningId: 1, seatNumber: 1 }, { unique: true });

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
