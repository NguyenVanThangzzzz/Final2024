import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db/connectDB.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import cartRoutes from "./routes/cart.route.js";
import cinemaRoutes from "./routes/cinema.route.js";
import movieRoutes from "./routes/movie.route.js";
import roomRoutes from "./routes/room.route.js";
import screeningRoutes from "./routes/screening.route.js";
import ticketRoutes from "./routes/ticket.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// List of allowed origins
const allowedOrigins = ["http://localhost:3005", "http://localhost:5173"];

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps or curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies, authentication headers, etc.)
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

// Start the server
app.listen(PORT, () => {
  connectDB(); // Connect to the database
  console.log("Server is running on port: ", PORT);
});
