import mongoose from "mongoose";

const cinemaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    streetName: { type: String, required: true },
    postalCode: { type: String },
    phoneNumber: { type: String },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const Cinema = mongoose.model("Cinema", cinemaSchema);

export default Cinema;
