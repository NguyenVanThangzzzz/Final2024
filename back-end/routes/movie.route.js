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

router.get("/", getAllMovies); // get all movies page

router.get("/genres/:genres", getMovieByGenres); // get all movies by genres

router.get("/featured", getFeaturedMovies); // get all featured movies

router.put("/update/:id", protectRoute, adminRoute, updateMovie); // update movie page

router.patch(
  "/FeaturedMovie/:id",
  protectRoute,
  adminRoute,
  toggleFeaturedMovie
); // update movie page

router.post("/", protectRoute, adminRoute, createMovie); // create movie page

router.delete("/delete/:id", protectRoute, adminRoute, deleteMovie); // delete movie page

export default router;
