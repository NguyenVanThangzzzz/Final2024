import { motion } from "framer-motion";
import { Loader, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useCinemaStore } from "../../Store/cinemaStore"; // To fetch cinema names
import { useRoomStore } from "../../Store/roomStore"; // Assuming you have a room store

const CreateRoomForm = () => {
  const [newRoom, setNewRoom] = useState({
    name: "",
    seatCapacity: 0,
    screenType: "",
    price: 0,
    cinemaId: "",
  });

  const { createRoom, loading } = useRoomStore();
  const { cinemas, fetchAllCinemas } = useCinemaStore(); // Fetching cinema names

  useEffect(() => {
    fetchAllCinemas(); // Gọi hàm để lấy danh sách rạp chiếu phim
  }, [fetchAllCinemas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRoom(newRoom);
      setNewRoom({
        name: "",
        seatCapacity: 0,
        screenType: "",
        price: 0,
        cinemaId: "",
      });
    } catch {
      console.log("error creating a room");
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
        Create New Room
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Room Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Seat Capacity */}
        <div>
          <label
            htmlFor="seatCapacity"
            className="block text-sm font-medium text-gray-300"
          >
            Seat Capacity
          </label>
          <input
            type="number"
            id="seatCapacity"
            name="seatCapacity"
            value={newRoom.seatCapacity}
            onChange={(e) =>
              setNewRoom({ ...newRoom, seatCapacity: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Screen Type */}
        <div>
          <label
            htmlFor="screenType"
            className="block text-sm font-medium text-gray-300"
          >
            Screen Type
          </label>
          <input
            type="text"
            id="screenType"
            name="screenType"
            value={newRoom.screenType}
            onChange={(e) =>
              setNewRoom({ ...newRoom, screenType: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newRoom.price}
            onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Cinema Selection */}
        <div>
          <label
            htmlFor="cinemaId"
            className="block text-sm font-medium text-gray-300"
          >
            Select Cinema
          </label>
          <select
            id="cinemaId"
            name="cinemaId"
            value={newRoom.cinemaId}
            onChange={(e) =>
              setNewRoom({ ...newRoom, cinemaId: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a cinema</option>
            {cinemas.map((cinema) => (
              <option key={cinema._id} value={cinema._id}>
                {cinema.name}
              </option>
            ))}
          </select>
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
              Create Room
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateRoomForm;
