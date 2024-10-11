import jwt from "jsonwebtoken";
import { redis } from "../db/redis.js";
import Admin from "../models/admin.js";
import { User } from "../models/user.js";

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

// export const signup = async (req, res) => {
//   const { email, password, name } = req.body;

//   try {
//     const adminExists = await Admin.findOne({ email });
//     if (adminExists) {
//       res.status(400);
//       throw new Error("Admin already exists");
//     }
//     const admin = await Admin.create({
//       name,
//       email,
//       password,
//     });
//     //authenticate
//     const { accessToken, refreshToken } = generateTokens(admin._id);
//     await storeRefreshToken(refreshToken, admin._id);
//     setCookies(res, accessToken, refreshToken);

//     res.status(201).json({
//       _id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       role: admin.role,
//     });
//   } catch (error) {
//     console.log("Error in signup controller", error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

export const adminLogin = async (req, res) => {
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

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.adminId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { adminId: decoded.adminId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.admin);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({
      name,
      email,
      password, // Mật khẩu sẽ được hash tự động bởi middleware pre-save của Mongoose
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { _id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { name, email } = req.query;

    const queryObject = {};

    if (name) {
      queryObject.name = { $regex: name, $options: "i" };
    }

    if (email) {
      queryObject.email = email;
    }

    const users = await User.find(queryObject).select("-password");

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteAllUser = async (req, res) => {
  try {
    const result = await User.deleteMany({});

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} users deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (name) user.name = name;
    if (password) {
      user.password = password; // Mật khẩu sẽ được hash tự động bởi middleware pre-save của Mongoose
    }
    await user.save();
    res.json({ message: "User updated successfully", user: { _id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const adminSignup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await Admin.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await Admin.create({
      name,
      email,
      password,
      role: "user", // Mặc định là user thông thường
    });
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(refreshToken, user._id);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in admin signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// export const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await Admin.findOne({ email, role: { $in: ["admin", "manager"] } });
//     if (user && (await user.comparePassword(password))) {
//       const { accessToken, refreshToken } = generateTokens(user._id);
//       await storeRefreshToken(refreshToken, user._id);
//       setCookies(res, accessToken, refreshToken);

//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       });
//     } else {
//       res.status(400).json({ message: "Invalid email or password" });
//     }
//   } catch (error) {
//     console.log("Error in admin login controller", error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

// Thêm controller mới để cấp quyền
export const assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!['user', 'manager', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "Role assigned successfully", user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.log("Error in assign role controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};