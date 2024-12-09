import cloudinary from "../db/cloudinary.js";
import { redis } from "../db/redis.js";
import Movie from "../models/movie.js";

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json({ movies });
  } catch (error) {
    console.log("Error in getAllMovies controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedMovies = async (req, res) => {
  try {
    let featuredMovies = await redis.get("featured_movies");
    if (featuredMovies) {
      return res.json(JSON.parse(featuredMovies));
    }
    // if not in redis, get from db
    featuredMovies = await Movie.find({ isFeatured: true }).lean();

    if (!featuredMovies) {
      return res.status(404).json({ message: "No featured movies found" });
    }

    // store in redis for future quick access
    await redis.set("featured_movies", JSON.stringify(featuredMovies));
  } catch (error) {
    console.log("Error in getFeaturedMovies controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createMovie = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      genres,
      director,
      actors,
      isFeatured,
    } = req.body;

    // Validate genres array
    if (!Array.isArray(genres) || genres.length === 0) {
      return res.status(400).json({ 
        message: "At least one genre must be selected" 
      });
    }

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "movies",
      });
    }

    const movie = await Movie.create({
      name,
      description,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      genres,
      director,
      actors,
      isFeatured,
    });

    res.status(201).json({ 
      success: true,
      message: "Movie created successfully",
      movie 
    });
  } catch (error) {
    console.log("Error in createMovie controller", error.message);
    res.status(500).json({ 
      success: false,
      message: "Failed to create movie",
      error: error.message 
    });
  }
};

export const updateMovie = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Validate genres array if it's being updated
    if (updateData.genres && (!Array.isArray(updateData.genres) || updateData.genres.length === 0)) {
      return res.status(400).json({ 
        success: false,
        message: "At least one genre must be selected" 
      });
    }

    // Handle image upload if new image is provided
    if (updateData.image && updateData.image.startsWith('data:image')) {
      const cloudinaryResponse = await cloudinary.uploader.upload(updateData.image, {
        folder: "movies",
      });
      updateData.image = cloudinaryResponse.secure_url;
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      id, 
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ 
        success: false,
        message: "Movie not found" 
      });
    }

    res.status(200).json({
      success: true, 
      message: "Movie updated successfully",
      movie: updatedMovie
    });
  } catch (error) {
    console.error("Error in updateMovie controller:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update movie", 
      error: error.message 
    });
  }
};

export const toggleFeaturedMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      movie.isFeatured = !movie.isFeatured;
      const updatedMovie = await movie.save();
      await updateFeaturedMoviesCache();
      res.json({ updatedMovie });
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedMovie controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

async function updateFeaturedMoviesCache() {
  try {
    const featuredMovies = await Movie.find({ isFeatured: true }).lean();
    await redis.set("featured_movies", JSON.stringify(featuredMovies));
  } catch (error) {
    console.log("error in update cache function");
  }
}

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true,
      message: "Movie deleted successfully" 
    });
  } catch (error) {
    console.log("Error in deleteMovie controller", error.message);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete movie",
      error: error.message 
    });
  }
};

export const getMovieByGenres = async (req, res) => {
  const { genres } = req.params;
  try {
    const movies = await Movie.find({ genres });
    res.json({ movies });
  } catch (error) {
    console.log("Error in getMovieByGenres controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
