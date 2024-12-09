import express from "express";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getFeaturedMovies,
  getMovieByGenres,
  toggleFeaturedMovie,
  updateMovie,
} from "../controllers/movieController.js";

import { adminRoute, protectRoute } from "../Middlewares/adminMiddlewares.js";
const router = express.Router();

router.get("/", getAllMovies);
router.get("/genres/:genres", getMovieByGenres);
router.get("/featured", getFeaturedMovies);

router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);
router.patch("/FeaturedMovie/:id", protectRoute, adminRoute, toggleFeaturedMovie);
router.post("/", protectRoute, adminRoute, createMovie);

export default router;
