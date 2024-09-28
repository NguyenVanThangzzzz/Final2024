import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductByCategory,
  updateProduct,
  toggleFeaturedProduct,
} from "../controllers/productController.js";

import { adminRoute, protectRoute } from "../Middlewares/admin.js";
const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts); // get all products page

router.get("/category/:category", getProductByCategory); // get all products page

router.get("/featured", getFeaturedProducts); // get all products page

router.put("/update/:id", protectRoute, adminRoute, updateProduct); // update product page

router.patch(
  "/FeaturedProduct/:id",
  protectRoute,
  adminRoute,
  toggleFeaturedProduct
); // update product page

router.post("/", protectRoute, adminRoute, createProduct); // create product page

router.delete("/delete/:id", protectRoute, adminRoute, deleteProduct); // delete product page

export default router;
