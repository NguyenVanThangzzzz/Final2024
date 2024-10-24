import express from "express";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
} from "../controllers/roomController.js";

import { adminRoute, protectRoute } from "../Middlewares/adminMiddlewares.js";
const router = express.Router();

// Route để tạo phòng mới
router.post("/", createRoom, protectRoute, adminRoute);

// Route để lấy danh sách tất cả các phòng
router.get("/", getAllRooms);

// Route để lấy thông tin một phòng theo ID
router.get("/:id", getRoomById);

// Route để cập nhật thông tin phòng
router.put("/:id", updateRoom, protectRoute, adminRoute);

// Route để xóa phòng
router.delete("/:id", deleteRoom, protectRoute, adminRoute);

export default router;
