import { User } from "../models/User.js";
import Order from "../models/order.js";
import Movie from "../models/movie.js";

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

    // Lấy số phim đang chiếu (có suất chiếu)
    const activeMovies = await Movie.countDocuments({ isActive: true });

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