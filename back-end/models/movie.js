import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    genres: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    actors: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
