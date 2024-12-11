import express from "express";
import { createCheckoutSession, checkoutSuccess, cancelPayment } from "../controllers/paymentController.js";
import { protect } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);
router.get("/success", protect, checkoutSuccess);
router.post("/cancel", protect, cancelPayment);

export default router;
