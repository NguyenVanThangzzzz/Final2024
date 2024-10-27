import { motion } from "framer-motion";
import { Edit3, Trash } from "lucide-react"; // Icons for delete and edit actions
import React, { useEffect } from "react";
import { useMovieStore } from "../../Store/movieStore";

const MovieList = () => {
  const { deleteMovie, movies, fetchAllMovies } = useMovieStore();

  useEffect(() => {
    fetchAllMovies();
  }, [fetchAllMovies]);

  // Kiểm tra nếu movies chưa tải xong
  if (!movies) {
    return <p>Loading...</p>;
  }

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-8xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              style={{ width: "10%" }}
            >
              Image
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              style={{ width: "20%" }}
            >
              Name
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              style={{ width: "30%" }}
            >
              Description
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              style={{ width: "15%" }}
            >
              Genres
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              style={{ width: "15%" }}
            >
              Director
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              style={{ width: "15%" }}
            >
              Actors
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              style={{ width: "10%" }}
            >
              Featured
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {movies.map((movie, index) => (
            <tr key={movie._id || index} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={movie.image}
                  alt={movie.name}
                />
              </td>
              <td className="px-6 py-4 whitespace-normal">{movie.name}</td>
              <td className="px-6 py-4 whitespace-normal">
                {movie.description}
              </td>
              <td className="px-6 py-4 whitespace-normal">{movie.genres}</td>
              <td className="px-6 py-4 whitespace-normal">{movie.director}</td>
              <td className="px-6 py-4 whitespace-normal">{movie.actors}</td>
              <td className="px-6 py-4 whitespace-normal">
                {movie.isFeatured ? "Yes" : "No"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap flex items-center">
                {/* Edit Action */}
                <button
                  onClick={() => console.log(`Edit movie ${movie._id}`)}
                  className="text-yellow-400 hover:text-yellow-500 focus:outline-none mr-4"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                {/* Delete Action */}
                <button
                  onClick={() => deleteMovie(movie._id)}
                  className="text-red-500 hover:text-red-600 focus:outline-none"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default MovieList;
