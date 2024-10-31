import express from "express";
import {
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  getTicketsByUser,
  getSeatInfo,
  getScreeningSeats,
  getScreeningDetail
} from "../controllers/ticketController.js";
import { protectRoute } from "../Middlewares/adminMiddlewares.js";

const router = express.Router();

router.get("/", protectRoute, getAllTickets);
router.post("/", protectRoute, createTicket);
router.get("/user/:userId", protectRoute, getTicketsByUser);
router.get("/:id", protectRoute, getTicketById);
router.put("/:id", protectRoute, updateTicketStatus);
router.delete("/:id", protectRoute, deleteTicket);
router.get("/seats/:screeningId", getScreeningSeats);
router.get("/seat-info/:screeningId/:seatNumber", getSeatInfo);
router.get("/screening-detail/:screeningId", getScreeningDetail);

export default router;
