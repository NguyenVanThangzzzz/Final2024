import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ["available", "booked", "pending"],
    default: "available",
  },
  price: { type: Number, required: true },
});

const screeningSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    showTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    seatCapacity: { type: Number, required: true },
    price: { type: Number, required: true },
    seats: [seatSchema],
  },
  { timestamps: true }
);

// Hàm khởi tạo ghế dựa trên seatCapacity và giá
screeningSchema.pre("save", function (next) {
  if (this.isNew) {
    const SEATS_PER_ROW = 20;
    const totalRows = Math.ceil(this.seatCapacity / SEATS_PER_ROW);

    this.seats = [];
    for (let row = 0; row < totalRows; row++) {
      const rowLetter = String.fromCharCode(65 + row);
      for (let seatNum = 1; seatNum <= SEATS_PER_ROW; seatNum++) {
        if (this.seats.length < this.seatCapacity) {
          this.seats.push({
            seatNumber: `${rowLetter}${seatNum}`,
            status: "available",
            price: this.price,
          });
        }
      }
    }
  }
  next();
});

const Screening = mongoose.model("Screening", screeningSchema);

export default Screening;
