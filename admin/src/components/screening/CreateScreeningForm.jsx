import { motion } from "framer-motion";
import { Loader, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMovieStore } from "../../Store/movieStore";
import { useRoomStore } from "../../Store/roomStore";
import { useScreeningStore } from "../../Store/screeningStore";

const CreateScreeningForm = () => {
  const [newScreening, setNewScreening] = useState({
    roomId: "",
    movieId: "",
    showTime: "",
    endTime: "",
    seatCapacity: "",
    price: "",
  });

  const { createScreening, loading } = useScreeningStore();
  const { rooms, fetchAllRooms } = useRoomStore();
  const { movies, fetchAllMovies } = useMovieStore();

  useEffect(() => {
    fetchAllRooms();
    fetchAllMovies();
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
        seatCapacity: "",
        price: "",
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
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Room
          </label>
          <select
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
                {room.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Movie
          </label>
          <select
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
                {movie.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Show Time
          </label>
          <input
            type="datetime-local"
            value={newScreening.showTime}
            onChange={(e) =>
              setNewScreening({ ...newScreening, showTime: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            End Time
          </label>
          <input
            type="datetime-local"
            value={newScreening.endTime}
            onChange={(e) =>
              setNewScreening({ ...newScreening, endTime: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Seat Capacity
          </label>
          <input
            type="number"
            value={newScreening.seatCapacity}
            onChange={(e) =>
              setNewScreening({ ...newScreening, seatCapacity: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Price
          </label>
          <input
            type="number"
            value={newScreening.price}
            onChange={(e) =>
              setNewScreening({ ...newScreening, price: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
            min="0"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
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
