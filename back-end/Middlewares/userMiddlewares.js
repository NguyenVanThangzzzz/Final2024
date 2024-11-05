import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const userProtectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // Nếu không có accessToken và refreshToken
    if (!accessToken && !refreshToken) {
      return res.status(401).json({
        message: "Unauthorized - No access or refresh token provided",
      });
    }

    // Nếu có accessToken, kiểm tra tính hợp lệ của nó
    if (accessToken) {
      try {
        const decoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Đặt thông tin người dùng vào yêu cầu
        return next(); // Tiếp tục xử lý yêu cầu
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          // Nếu accessToken đã hết hạn, tiếp tục kiểm tra refreshToken
          console.log("Access token expired, checking refresh token...");
        } else {
          throw error; // Nếu lỗi khác, báo lỗi
        }
      }
    }

    // Nếu không có accessToken hoặc accessToken hết hạn, kiểm tra refreshToken
    if (refreshToken) {
      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        // Tìm người dùng dựa vào refreshToken
        const user = await User.findById(decodedRefreshToken.userId).select(
          "-password"
        );

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Tạo mới accessToken
        const newAccessToken = jwt.sign(
          { userId: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" } // Thời gian hết hạn của accessToken mới
        );

        // Đặt lại accessToken mới vào cookie
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, 
        });

        req.user = user; // Đặt thông tin người dùng vào yêu cầu
        return next(); // Tiếp tục xử lý yêu cầu
      } catch (error) {
        // Nếu refreshToken không hợp lệ, xóa cả hai cookie và báo lỗi
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res
          .status(401)
          .json({ message: "Unauthorized - Invalid refresh token" });
      }
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid access or refresh token" });
  }
};
