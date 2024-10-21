import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

export const protectRoute = async (req, res, next) => {
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
        const admin = await Admin.findById(decoded.adminId).select("-password");

        if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
        }

        req.admin = admin;
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

        const admin = await Admin.findById(decodedRefreshToken.adminId).select(
          "-password"
        );

        if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
          { adminId: admin._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" } // Set the expiration time for your access token
        );

        // Set the new access token in cookies
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        req.admin = admin;
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

export const adminRoute = (req, res, next) => {
  if (req.admin && req.admin.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};

// Thêm middleware mới cho manager
export const managerRoute = (req, res, next) => {
  if (
    req.admin &&
    (req.admin.role === "admin" || req.admin.role === "manager")
  ) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied - Admin or Manager only" });
  }
};
