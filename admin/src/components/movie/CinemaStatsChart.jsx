import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CinemaStatsChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dashboard/cinema-stats', {
          withCredentials: true
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching cinema stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-6 text-white">Cinema Performance</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
            <XAxis 
              dataKey="cinemaName" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#9CA3AF'
              }}
              cursor={{ fill: 'transparent' }}
            />
            <Legend />
            <Bar dataKey="totalTickets" name="Tickets Sold" fill="#10B981" />
            <Bar dataKey="totalRevenue" name="Revenue" fill="#3B82F6" />
            <Bar dataKey="seatOccupancy" name="Seat Occupancy %" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CinemaStatsChart; 