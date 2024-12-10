import { motion } from "framer-motion";
import { Loader, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useScreeningStore } from "../../Store/screeningStore";
import axios from "axios";

const EditScreeningForm = ({ screening, onClose }) => {
  const { updateScreening, loading } = useScreeningStore();
  const [rooms, setRooms] = useState([]);
  const [movies, setMovies] = useState([]);
  
  const [formData, setFormData] = useState({
    roomId: "",
    movieId: "",
    showTime: "",
    endTime: "",
    price: "",
    seatCapacity: ""
  });

  // Fetch rooms and movies when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsResponse, moviesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/room`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/movie`)
        ]);
        setRooms(roomsResponse.data.rooms);
        setMovies(moviesResponse.data.movies);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load rooms and movies');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (screening) {
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      const roomId = screening.roomId?._id || screening.roomId || "";
      const movieId = screening.movieId?._id || screening.movieId || "";

      setFormData({
        roomId,
        movieId,
        showTime: formatDate(screening.showTime) || "",
        endTime: formatDate(screening.endTime) || "",
        price: screening.price || "",
        seatCapacity: screening.seatCapacity || ""
      });
    }
  }, [screening]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = {
      roomId: "Room",
      movieId: "Movie",
      showTime: "Show Time",
      endTime: "End Time",
      price: "Price",
      seatCapacity: "Seat Capacity"
    };

    const emptyFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key])
      .map(([_, label]) => label);

    if (emptyFields.length > 0) {
      toast.error(`Please fill in all required fields: ${emptyFields.join(", ")}`);
      return;
    }

    // Validate show time and end time
    const showTime = new Date(formData.showTime);
    const endTime = new Date(formData.endTime);
    const now = new Date();

    if (showTime < now) {
      toast.error("Show time cannot be in the past");
      return;
    }

    if (endTime <= showTime) {
      toast.error("End time must be after show time");
      return;
    }

    try {
      await updateScreening(screening._id, formData);
      toast.success("Screening updated successfully");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update screening");
      console.error("Error updating screening:", error);
    }
  };

  if (!screening) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-gray-800 rounded-lg p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
          Edit Screening
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Room <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              required
            >
              <option value="">Select a room</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name} - {room.cinemaId?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Movie Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Movie <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.movieId}
              onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
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

          {/* Show Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Show Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.showTime}
              onChange={(e) => setFormData({ ...formData, showTime: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Seat Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Seat Capacity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.seatCapacity}
              onChange={(e) => setFormData({ ...formData, seatCapacity: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              required
              min="1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditScreeningForm; 