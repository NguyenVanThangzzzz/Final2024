import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const admin = await Admin.findById(decoded.adminId).select("-password");

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      req.admin = admin;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Access token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid access token" });
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
  if (req.admin && (req.admin.role === "admin" || req.admin.role === "manager")) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin or Manager only" });
  }
};
