import express from "express";
import { adminRoute, protectRoute } from "../Middlewares/adminMiddlewares.js";
import {
    createScreening,
    getAllScreenings,
    getScreeningById,
    updateScreening,
    deleteScreening,
} from "../controllers/screeningController.js";

const router = express.Router();

// Định nghĩa các route cho CRUD
router.post("/", protectRoute, adminRoute, createScreening); // Tạo screening
router.get("/", getAllScreenings); // Lấy tất cả screenings
router.get("/:id", getScreeningById); // Lấy screening theo ID
router.put("/:id", protectRoute, adminRoute, updateScreening); // Cập nhật screening
router.delete("/:id", protectRoute, adminRoute, deleteScreening); // Xóa screening

export default router;
