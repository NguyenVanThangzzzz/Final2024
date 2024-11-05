import express from "express";
import { createCheckoutSession, checkoutSuccess, handleStripeWebhook } from "../controllers/paymentController.js";

import { userProtectRoute } from "../Middlewares/userMiddlewares.js";

const router = express.Router();

router.post("/create-checkout-session", userProtectRoute, createCheckoutSession);
router.get("/checkout-success", userProtectRoute, checkoutSuccess);
router.post("/webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
