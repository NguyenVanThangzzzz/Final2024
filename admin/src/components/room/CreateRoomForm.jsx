import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useCinemaStore } from "../../Store/cinemaStore";
import { useRoomStore } from "../../Store/roomStore";
import { Loader, PlusCircle } from "lucide-react";
import { SCREEN_TYPES, ROOM_TYPES } from "../../constants/roomConstants";

const CreateRoomForm = () => {
  const { createRoom, loading } = useRoomStore();
  const { cinemas, fetchAllCinemas } = useCinemaStore();
  const [formData, setFormData] = useState({
    name: "",
    cinemaId: "",
    screenType: "",
    roomType: "",
  });

  useEffect(() => {
    fetchAllCinemas();
  }, [fetchAllCinemas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createRoom(formData);
    setFormData({
      name: "",
      cinemaId: "",
      screenType: "",
      roomType: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Room
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Room Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Cinema
          </label>
          <select
            name="cinemaId"
            value={formData.cinemaId}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select Cinema</option>
            {cinemas.map((cinema) => (
              <option key={cinema._id} value={cinema._id}>
                {cinema.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Screen Type
          </label>
          <select
            name="screenType"
            value={formData.screenType}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select Screen Type</option>
            {SCREEN_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Room Type
          </label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select Room Type</option>
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
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
              Create Room
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateRoomForm;
