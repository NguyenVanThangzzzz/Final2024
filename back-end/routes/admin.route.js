import express from "express";
import {
  adminLogin,
  adminSignup,
  assignRole,
  createUser,
  deleteAllUser,
  deleteUser,
  getAllUser,
  getProfile,
  logout,
  refreshToken,
  searchUser,
  updateUser,
} from "../controllers/adminController.js";
import {
  adminRoute,
  managerRoute,
  protectRoute,
} from "../Middlewares/adminMiddlewares.js";

const router = express.Router();

// Admin authentication routes
router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

// User management routes (chỉ admin mới có quyền CRUD)
router.post("/users", protectRoute, adminRoute, createUser);
router.get("/users", protectRoute, managerRoute, getAllUser);
router.get("/users/search", protectRoute, managerRoute, searchUser, adminRoute);
router.delete("/users/:id", protectRoute, adminRoute, deleteUser);
router.delete("/users", protectRoute, adminRoute, deleteAllUser);
router.put("/users/:id", protectRoute, adminRoute, updateUser);

// Route for assigning roles (chỉ admin mới có quyền)
router.post("/assign-role", protectRoute, adminRoute, assignRole);

export default router;
