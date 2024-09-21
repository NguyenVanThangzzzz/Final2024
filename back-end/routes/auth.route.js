import express from "express";
import {
  checkAuth,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  verifyEmail,
} from "../controllers/authController.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth); // check auth page

router.post("/signup", signup); // signup page

router.post("/login", login); // login page

router.post("/logout", logout); // logout page

router.post("/verify-email", verifyEmail); // verify email page

router.post("/forgot-password", forgotPassword); // forgot password page

router.post("/reset-password/:token", resetPassword); // reset password page
export default router;
