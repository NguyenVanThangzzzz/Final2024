import { motion } from "framer-motion";
import { Loader, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMovieStore } from "../../Store/movieStore"; // Store cho phim
import { useRoomStore } from "../../Store/roomStore"; // Store cho phòng
import { useScreeningStore } from "../../Store/screeningStore";

const CreateScreeningForm = () => {
  const [newScreening, setNewScreening] = useState({
    roomId: "",
    movieId: "",
    showTime: "",
    endTime: "",
  });

  const { createScreening, loading } = useScreeningStore();
  const { rooms, fetchAllRooms } = useRoomStore(); // Lấy danh sách phòng từ store
  const { movies, fetchAllMovies } = useMovieStore(); // Lấy danh sách phim từ store

  useEffect(() => {
    fetchAllRooms(); // Gọi hàm để lấy danh sách phòng
    fetchAllMovies(); // Gọi hàm để lấy danh sách phim
  }, [fetchAllRooms, fetchAllMovies]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createScreening(newScreening);
      setNewScreening({
        roomId: "",
        movieId: "",
        showTime: "",
        endTime: "",
      });
    } catch {
      console.log("error creating a screening");
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Screening
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room Selection */}
        <div>
          <label
            htmlFor="roomId"
            className="block text-sm font-medium text-gray-300"
          >
            Room
          </label>
          <select
            id="roomId"
            name="roomId"
            value={newScreening.roomId}
            onChange={(e) =>
              setNewScreening({ ...newScreening, roomId: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                {room.name} {/* Hiển thị tên phòng */}
              </option>
            ))}
          </select>
        </div>

        {/* Movie Selection */}
        <div>
          <label
            htmlFor="movieId"
            className="block text-sm font-medium text-gray-300"
          >
            Movie
          </label>
          <select
            id="movieId"
            name="movieId"
            value={newScreening.movieId}
            onChange={(e) =>
              setNewScreening({ ...newScreening, movieId: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a movie</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.name} {/* Hiển thị tên phim */}
              </option>
            ))}
          </select>
        </div>

        {/* Show Time */}
        <div>
          <label
            htmlFor="showTime"
            className="block text-sm font-medium text-gray-300"
          >
            Show Time
          </label>
          <input
            type="datetime-local"
            id="showTime"
            name="showTime"
            value={newScreening.showTime}
            onChange={(e) =>
              setNewScreening({ ...newScreening, showTime: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* End Time */}
        <div>
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-300"
          >
            End Time
          </label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={newScreening.endTime}
            onChange={(e) =>
              setNewScreening({ ...newScreening, endTime: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Screening
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateScreeningForm;
