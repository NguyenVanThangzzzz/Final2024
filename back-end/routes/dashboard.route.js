import express from "express";
import { getUserStats, getMovieStats, getMovieRevenue } from "../controllers/dashboardController.js";
import { protectRoute } from "../Middlewares/adminMiddlewares.js";

const router = express.Router();

router.get("/user-stats", protectRoute, getUserStats);
router.get("/movie-stats", protectRoute, getMovieStats);
router.get("/movie-revenue", protectRoute, getMovieRevenue);

export default router; 