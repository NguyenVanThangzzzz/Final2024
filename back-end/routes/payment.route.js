import express from "express";
import { createCheckoutSession, checkoutSuccess, handleStripeWebhook } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.get("/success", checkoutSuccess);
router.post("/webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
