import mongoose from "mongoose";

// Định nghĩa schema cho từng ghế ngồi
const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true }, // Số ghế
  status: {
    type: String,
    enum: ["available", "booked", "pending"], // Các trạng thái ghế
    default: "available", // Mặc định ghế là trống
  },
  price: { type: Number, required: true }, // Giá vé cho ghế
});

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    seatCapacity: { type: Number, required: true }, // Sức chứa của phòng
    seats: [seatSchema], // Mảng các ghế với trạng thái và giá vé
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
    },
    screenType: { type: String, required: true }, // Loại màn hình (2D, 3D, IMAX)
    price: { type: Number, required: true }, // Giá cho tất cả ghế trong phòng
    date: { type: Date, required: true }, // Thêm trường date
  },
  { timestamps: true }
);

// Hàm khởi tạo ghế dựa trên seatCapacity và giá người dùng cung cấp
roomSchema.pre("save", function (next) {
  if (this.isNew) {
    for (let i = 1; i <= this.seatCapacity; i++) {
      this.seats.push({
        seatNumber: `Seat ${i}`,
        status: "available",
        price: this.price, // Toàn bộ ghế có cùng 1 giá
      });
    }
  }
  next();
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
