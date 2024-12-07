import { User } from "../models/User.js";

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

    // Debug logs
    console.log('Raw MongoDB Stats:', stats);
    console.log('Current Year:', currentYear);
    console.log('Monthly Data:', monthlyData);
    console.log('Total Users:', totalUsers);
    console.log('New Users This Month:', newUsersThisMonth);
    console.log('Active Users:', activeUsers);

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