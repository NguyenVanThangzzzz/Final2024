import express from "express";
import { createOrder, getMyOrders, cancelOrder, getUserOrders } from "../controllers/orderController.js";
import { userProtectRoute } from "../Middlewares/userMiddlewares.js";

const router = express.Router();

// Route đặt vé mới
router.post("/create", userProtectRoute, createOrder);

// Route lấy danh sách vé của user
router.get("/my-orders", userProtectRoute, getMyOrders);

// Route hủy vé
router.put("/cancel/:ticketId", userProtectRoute, cancelOrder);

// Thêm route mới
router.get('/user-orders', userProtectRoute, getUserOrders);

export default router;