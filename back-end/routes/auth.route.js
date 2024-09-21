import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup); // signup page

router.post("/login", login); // login page

router.post("/logout", logout); // logout page

router.post("/verify-email", verifyEmail); // verify email page
export default router;