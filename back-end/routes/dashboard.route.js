import express from "express";
import { getUserStats } from "../controllers/dashboardController.js";
import { protectRoute, adminRoute } from "../Middlewares/adminMiddlewares.js";

const router = express.Router();

router.get("/user-stats", protectRoute, adminRoute, getUserStats);

export default router; 