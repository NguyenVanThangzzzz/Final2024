import express from "express";
import {
  addToCart,
  getCart,
  removeAllFromCart,
  updateCart,
} from "../controllers/cartController.js";
import { protectRoute } from "../Middlewares/adminMiddlewares.js";

const router = express.Router();

router.get("/", protectRoute, getCart); // get cart page

router.post("/", protectRoute, addToCart); // add to cart page

// router.delete("/delete/:id", protectRoute, removeCart); // remove from cart page

router.delete("/", protectRoute, removeAllFromCart); // remove all from cart page

router.put("/", protectRoute, updateCart); // update cart page

export default router;
