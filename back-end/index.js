import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db/connectDB.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import cartRoutes from "./routes/cart.route.js";
import cinemaRoutes from "./routes/cinema.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import movieRoutes from "./routes/movie.route.js";
import orderRoutes from "./routes/order.route.js";
import paymentRoutes from "./routes/payment.route.js";
import roomRoutes from "./routes/room.route.js";
import screeningRoutes from "./routes/screening.route.js";
import ticketRoutes from "./routes/ticket.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// List of allowed origins
const allowedOrigins = [
  "http://localhost:3005",
  "http://localhost:5173",
  "http://localhost:3000", // Common React development port
  "http://127.0.0.1:5173", // Alternative localhost
  "http://127.0.0.1:3000",
  "https://linuxcinema.com",
  "https://final2024-production-33e1.up.railway.app",
  "https://final2024-production-7196.up.railway.app",
];

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`Blocked request from origin: ${origin}`); // Add logging
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

app.use(express.json({ limit: "10mb" })); // Tăng giới hạn kích thước payload lên 10MB
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/cinema", cinemaRoutes);
app.use("/api/screening", screeningRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Add error handling middleware after your routes
app.use((err, req, res, next) => {
  if (err.message.startsWith("Origin")) {
    return res.status(403).json({
      error: "CORS Error",
      message: err.message,
    });
  }
  // Handle other errors
  console.error(err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// Start the server
app.listen(PORT, () => {
  connectDB(); // Connect to the database
});
