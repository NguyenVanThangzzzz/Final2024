import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["available", "booked", "pending"],
    default: "available",
  },
  price: {
    type: Number,
    required: true
  },
});

const screeningSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },
  showTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  seatCapacity: {
    type: Number,
    required: true
  },
  seats: [seatSchema]
}, { timestamps: true });

// Middleware để tự động tạo ghế khi tạo screening mới
screeningSchema.pre("save", function (next) {
  if (this.isNew) {
    const SEATS_PER_ROW = 20; // Số ghế mỗi hàng
    const totalRows = Math.ceil(this.seatCapacity / SEATS_PER_ROW); // Tính số hàng dựa vào seatCapacity

    for (let row = 0; row < totalRows; row++) {
      const rowLetter = String.fromCharCode(65 + row); // Chuyển số thành chữ cái (0 -> A, 1 -> B, ...)

      // Tạo ghế cho mỗi hàng
      for (let seatNum = 1; seatNum <= SEATS_PER_ROW; seatNum++) {
        // Chỉ tạo ghế nếu chưa đạt đến seatCapacity
        if ((row * SEATS_PER_ROW + seatNum) <= this.seatCapacity) {
          this.seats.push({
            seatNumber: `${rowLetter}${seatNum}`, // Format: A1, A2, ..., B1, B2, ...
            status: "available",
            price: this.price
          });
        }
      }
    }
  }
  next();
});

const Screening = mongoose.model("Screening", screeningSchema);

export default Screening;
