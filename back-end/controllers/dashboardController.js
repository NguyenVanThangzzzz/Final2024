import { User } from "../models/User.js";
import Order from "../models/order.js";
import Movie from "../models/movie.js";
import Screening from "../models/screening.js";

export const getUserStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Get user registration stats by month for current year
    const stats = await User.aggregate([
      {
        $match: {
          lastLogin: {
            $exists: true,
            $ne: null
          }
        }
      },
      {
        $project: {
          month: { $month: "$lastLogin" },
          year: { $year: "$lastLogin" }
        }
      },
      {
        $match: {
          year: currentYear
        }
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Initialize monthly data array with zeros
    const monthlyData = Array(12).fill(0);

    // Fill in actual registration counts
    stats.forEach(item => {
      monthlyData[item._id - 1] = item.count;
    });

    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get new users this month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
    
    const newUsersThisMonth = await User.countDocuments({
      lastLogin: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Get verified/active users
    const activeUsers = await User.countDocuments({ isVerified: true });

    res.json({
      success: true,
      data: {
        monthlyData,
        totalUsers,
        newUsersThisMonth,
        activeUsers
      }
    });
  } catch (error) {
    console.error("Error in getUserStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user statistics",
      error: error.message
    });
  }
};

export const getMovieStats = async (req, res) => {
  try {
    // Lấy thống kê đặt vé theo phim
    const movieStats = await Order.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "ticketId",
          foreignField: "_id",
          as: "ticket"
        }
      },
      { $unwind: "$ticket" },
      {
        $lookup: {
          from: "movies",
          localField: "ticket.movieId",
          foreignField: "_id",
          as: "movie"
        }
      },
      { $unwind: "$movie" },
      {
        $group: {
          _id: "$movie._id",
          movieName: { $first: "$movie.name" },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 10 } // Lấy top 10 phim
    ]);

    // Lấy tổng số phim
    const totalMovies = await Movie.countDocuments();

    // Lấy số phim đang chiếu (có suất chiếu trong tương lai)
    const now = new Date();
    const activeMovies = await Screening.aggregate([
      {
        $match: {
          endTime: { $gt: now } // Lấy các suất chiếu chưa kết thúc
        }
      },
      {
        $group: {
          _id: "$movieId", // Gom nhóm theo movieId để không đếm trùng
          count: { $sum: 1 }
        }
      },
      {
        $count: "total" // Đếm số lượng phim duy nhất
      }
    ]).then(result => result[0]?.total || 0);

    res.json({
      success: true,
      data: {
        movieStats,
        totalMovies,
        activeMovies
      }
    });
  } catch (error) {
    console.error("Error in getMovieStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching movie statistics",
      error: error.message
    });
  }
};

export const getMovieRevenue = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Aggregate monthly revenue from orders
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: "paid",
          paymentDate: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31, 23, 59, 59)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$paymentDate" },
          revenue: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Initialize revenue data for all months
    const revenueData = Array(12).fill(0);
    
    // Fill in actual revenue data
    monthlyRevenue.forEach(item => {
      revenueData[item._id - 1] = item.revenue;
    });

    // Calculate total revenue and other stats
    const totalRevenue = revenueData.reduce((sum, amount) => sum + amount, 0);
    const averageRevenue = totalRevenue / 12;
    
    // Get current month's revenue
    const currentMonth = new Date().getMonth();
    const currentMonthRevenue = revenueData[currentMonth];

    res.json({
      success: true,
      data: {
        monthlyRevenue: revenueData,
        totalRevenue,
        averageRevenue,
        currentMonthRevenue
      }
    });
  } catch (error) {
    console.error("Error in getMovieRevenue:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching revenue data",
      error: error.message
    });
  }
};

export const getCinemaStats = async (req, res) => {
  try {
    const cinemaStats = await Order.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "ticketId",
          foreignField: "_id",
          as: "ticket"
        }
      },
      { $unwind: "$ticket" },
      {
        $lookup: {
          from: "rooms",
          localField: "ticket.roomId",
          foreignField: "_id",
          as: "room"
        }
      },
      { $unwind: "$room" },
      {
        $lookup: {
          from: "cinemas",
          localField: "room.cinemaId",
          foreignField: "_id",
          as: "cinema"
        }
      },
      { $unwind: "$cinema" },
      {
        $group: {
          _id: "$cinema._id",
          cinemaName: { $first: "$cinema.name" },
          totalTickets: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          seatOccupancy: {
            $avg: {
              $divide: [
                { $size: "$ticket.seatNumbers" },
                "$room.seatCapacity"
              ]
            }
          }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({
      success: true,
      data: cinemaStats
    });
  } catch (error) {
    console.error("Error in getCinemaStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cinema statistics",
      error: error.message
    });
  }
};

export const getGenreStats = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "ticketId",
          foreignField: "_id",
          as: "ticket"
        }
      },
      { $unwind: "$ticket" },
      {
        $lookup: {
          from: "movies",
          localField: "ticket.movieId",
          foreignField: "_id",
          as: "movie"
        }
      },
      { $unwind: "$movie" },
      // Unwind genres array để tách từng thể loại thành document riêng
      { $unwind: "$movie.genres" },
      {
        $group: {
          _id: "$movie.genres", // Nhóm theo từng thể loại riêng lẻ
          totalTickets: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      {
        $project: {
          genre: "$_id",
          totalTickets: 1,
          totalRevenue: 1,
          _id: 0
        }
      },
      {
        $sort: { totalRevenue: -1 }
      }
    ]);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error("Error in getGenreStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching genre statistics",
      error: error.message
    });
  }
}; 