import express from "express";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomByCinema,
  getRoomById,
  updateRoom,
  getRoomSeats,
  updateSeatStatus,
  updateMultipleSeats,
} from "../controllers/roomController.js";

import { adminRoute, protectRoute } from "../Middlewares/adminMiddlewares.js";
const router = express.Router();

// Route để tạo phòng mới
router.post("/", createRoom, protectRoute, adminRoute);

// Route để lấy danh sách tất cả các phòng
router.get("/", getAllRooms);

// Route để lấy danh sách các phòng theo ID của rạp chiếu
router.get("/cinema/:cinemaId", getRoomByCinema);

// Route để lấy thông tin một phòng theo ID
router.get("/:id", getRoomById);

// Route để cập nhật thông tin phòng
router.put("/:id", updateRoom, protectRoute, adminRoute);

// Route để xóa phòng
router.delete("/:id", deleteRoom, protectRoute, adminRoute);

// Thêm các routes mới cho quản lý ghế
router.get("/:id/seats", getRoomSeats);
router.put("/:roomId/seats/:seatId", updateSeatStatus, protectRoute);
router.put("/:roomId/seats", updateMultipleSeats, protectRoute);

export default router;
