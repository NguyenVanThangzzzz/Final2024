import express from "express";
import {
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
} from "../controllers/ticketController.js";
import { protectRoute } from "../Middlewares/adminMiddlewares.js";
const router = express.Router();

router.get("/", protectRoute, getAllTickets);

// router.post("/buy", protectRoute, buyTicket); // Route mua vé
router.post("/", protectRoute, createTicket); // Route tạo vé mới
router.get("/:id", protectRoute, getTicketById); // Route lấy vé theo ID
router.delete("/:id", protectRoute, deleteTicket); // Route xóa vé

export default router;
