import mongoose from "mongoose";

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
    showTime: { type: Date, required: true }, // time of screening
    endTime: { type: Date, required: true }, // time when the screening ends
  },
  { timestamps: true }
);

const Screening = mongoose.model("Screening", screeningSchema);

export default Screening;
