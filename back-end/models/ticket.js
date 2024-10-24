import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
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
    seatNumber: { type: String, required: true },
    showTime: { type: Date, required: true }, // when the ticket is for
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
