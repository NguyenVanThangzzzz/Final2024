import jwt from "jsonwebtoken";
import { redis } from "../db/redis.js";
import Admin from "../models/admin.js";

const generateTokens = (adminId) => {
  const accessToken = jwt.sign({ adminId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ adminId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (refreshToken, adminId) => {
  await redis.set(
    `refresh_token:${adminId}`,
    refreshToken,
    "ex",
    7 * 24 * 60 * 60
  ); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15mins
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
  });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      res.status(400);
      throw new Error("Admin already exists");
    }
    const admin = await Admin.create({
      name,
      email,
      password,
    });
    //authenticate
    const { accessToken, refreshToken } = generateTokens(admin._id);
    await storeRefreshToken(refreshToken, admin._id);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(admin._id);
      await storeRefreshToken(refreshToken, admin._id);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.adminId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
