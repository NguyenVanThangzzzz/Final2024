import express from "express";
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  verifyEmail,
  refreshToken,
  getProfile,
} from "../controllers/AuthController.js";

import { userProtectRoute } from "../Middlewares/userMiddlewares.js";
import { User } from "../models/User.js";

const router = express.Router();

router.post("/signup", signup); // signup page

router.post("/login", login); // login page

router.post("/logout", logout); // logout page

router.post("/verify-email", verifyEmail); // verify email page

router.post("/forgot-password", forgotPassword); // forgot password page

router.post("/reset-password/:token", resetPassword); // reset password page

router.post("/refresh-token", refreshToken);
router.get("/profile", userProtectRoute, getProfile);

router.post('/change-password', userProtectRoute, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error in change password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
