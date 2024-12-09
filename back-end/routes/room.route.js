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

// Đặt middleware đúng vị trí (trước hàm controller)
router.post("/", protectRoute, adminRoute, createRoom);
router.get("/", getAllRooms);
router.get("/cinema/:cinemaId", getRoomByCinema);
router.get("/:id", getRoomById);
router.put("/:id", protectRoute, adminRoute, updateRoom);
router.delete("/:id", protectRoute, adminRoute, deleteRoom);
router.get("/:id/seats", getRoomSeats);
router.put("/:roomId/seats/:seatId", protectRoute, updateSeatStatus);
router.put("/:roomId/seats", protectRoute, updateMultipleSeats);

export default router;
