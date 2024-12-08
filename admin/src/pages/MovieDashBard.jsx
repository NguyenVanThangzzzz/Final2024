import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Film, PlayCircle, DollarSign } from "lucide-react";
import MovieDashboard from '../components/movie/MovieDashboard';
import CinemaStatsChart from '../components/movie/CinemaStatsChart';
import GenreStatsChart from '../components/movie/GenreStatsChart';

const MovieDashBard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dashboard/movie-stats', {
          withCredentials: true
        });
        setStats(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, gradient }) => (
    <div className={`${gradient} rounded-xl p-6 shadow-lg transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-white text-3xl font-bold">{value}</h3>
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
        <p className="font-medium">Error loading dashboard data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="container mx-auto px-4 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">Movie Analytics Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Movies"
          value={stats.totalMovies}
          icon={Film}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Active Movies"
          value={stats.activeMovies}
          icon={PlayCircle}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.movieStats.reduce((acc, curr) => acc + curr.totalRevenue, 0).toLocaleString()}`}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
      </div>

      {/* Movie Performance Chart */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-white">Most Popular Movies</h3>
        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.movieStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
              <XAxis 
                dataKey="movieName" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  color: '#9CA3AF',
                  padding: '10px'
                }}
                cursor={{ fill: 'transparent' }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px'
                }}
              />
              <Bar 
                dataKey="totalOrders" 
                name="Total Orders" 
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="totalRevenue" 
                name="Revenue ($)" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <MovieDashboard />

      {/* Cinema Stats */}
      <CinemaStatsChart />

      {/* Genre Stats */}
      <GenreStatsChart />
    </div>
  );
};

export default MovieDashBard;
