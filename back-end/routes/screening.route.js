import express from "express";
import { adminRoute, protectRoute } from "../Middlewares/adminMiddlewares.js";
import {
    createScreening,
    getAllScreenings,
    getScreeningById,
    updateScreening,
    deleteScreening,
    getScreeningsByRoom,
    updateSeatStatus,
    updateMultipleSeats,
    getScreeningSeats,
    holdSeat,
    releaseSeat,
} from "../controllers/screeningController.js";

const router = express.Router();

// Định nghĩa các route cho CRUD
router.post("/", protectRoute, adminRoute, createScreening); // Tạo screening
router.get("/", getAllScreenings); // Lấy tất cả screenings
router.get("/:id", getScreeningById); // Lấy screening theo ID
router.put("/:id", protectRoute, adminRoute, updateScreening); // Cập nhật screening
router.delete("/:id", protectRoute, adminRoute, deleteScreening); // Xóa screening
router.get('/room/:roomId', getScreeningsByRoom);
router.put("/:screeningId/seats/:seatNumber", updateSeatStatus);
router.put("/:screeningId/seats", updateMultipleSeats);
router.get("/:screeningId/seats", getScreeningSeats);
router.post('/:id/hold-seat', holdSeat);
router.post('/:id/release-seat', releaseSeat);

export default router;
