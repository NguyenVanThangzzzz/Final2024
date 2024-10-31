import express from "express";
import {
  createCinema,
  deleteCinema,
  getCinemaById,
  getCinemas,
  updateCinema,
} from "../controllers/cinemaController.js"; // Thêm import controller

import { adminRoute, protectRoute } from "../Middlewares/adminMiddlewares.js";

const router = express.Router();

// Định nghĩa các route cho CRUD
router.post("/", protectRoute, adminRoute, createCinema); // Tạo mới cinema
router.get("/", getCinemas); // Lấy danh sách cinema
router.get("/:id", getCinemaById); // Lấy cinema theo ID
router.put("/:id", protectRoute, adminRoute, updateCinema); // Cập nhật cinema
router.delete("/:id", protectRoute, adminRoute, deleteCinema); // Xóa cinema

export default router;
