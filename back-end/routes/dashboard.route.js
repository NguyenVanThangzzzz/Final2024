import express from "express";
import { getUserStats, getMovieStats } from "../controllers/dashboardController.js";
import { protectRoute, adminRoute } from "../Middlewares/adminMiddlewares.js";

const router = express.Router();

router.get("/user-stats", protectRoute, adminRoute, getUserStats);
router.get("/movie-stats", getMovieStats);

export default router; 