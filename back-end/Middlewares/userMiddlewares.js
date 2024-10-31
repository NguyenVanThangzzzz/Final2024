import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const userProtectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({
        message: "Unauthorized - No access or refresh token provided",
      });
    }

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

        req.user = user;
        return next();
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          // Continue to check for refresh token if access token is expired
        } else {
          throw error;
        }
      }
    }

    if (refreshToken) {
      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedRefreshToken.userId).select(
          "-password"
        );

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
          { userId: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" } // Set the expiration time for your access token
        );

        // Set the new access token in cookies
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        req.user = user;
        return next();
      } catch (error) {
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
