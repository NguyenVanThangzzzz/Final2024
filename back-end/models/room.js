import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
    },
    screenType: { type: String, required: true }, // Loại màn hình (2D, 3D, IMAX)
    roomType: { type: String, required: true }, // Thể loại phòng
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
