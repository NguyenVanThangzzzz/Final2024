import express from "express";
import { createCheckoutSession, checkoutSuccess, cancelPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.get("/success", checkoutSuccess);
router.post("/cancel", cancelPayment);

export default router;
