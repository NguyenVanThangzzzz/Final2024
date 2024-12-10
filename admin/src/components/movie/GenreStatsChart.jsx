import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#6366F1', // Indigo
  '#F472B6', // Pink
  '#FB923C', // Orange
  '#A855F7'  // Purple
];

const GenreStatsChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/genre-stats`, {
          withCredentials: true
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching genre stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Custom renderer cho Legend để hiển thị thể loại và số lượt xem
  const renderLegend = (props) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <li key={`legend-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-300">
              {entry.value} ({entry.payload.totalTickets} views)
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <p className="text-white font-semibold">{data.genre}</p>
          <p className="text-gray-300">Views: {data.totalTickets}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-6 text-white">Genre Distribution</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="totalTickets"
              nameKey="genre"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
                index
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = 25 + outerRadius;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill="#fff"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-xs"
                  >
                    {data[index].genre}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GenreStatsChart; 