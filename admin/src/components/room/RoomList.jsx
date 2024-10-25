import { motion } from "framer-motion";
import { Edit3, Trash } from "lucide-react";
import React, { useEffect } from "react";
import { useRoomStore } from "../../Store/roomStore";

const RoomList = () => {
  const { deleteRoom, rooms, fetchAllRooms } = useRoomStore();

  useEffect(() => {
    fetchAllRooms();
  }, [fetchAllRooms]);

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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Room Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Cinema Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Seat Capacity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Screen Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {rooms?.map((room) => (
            <tr key={room._id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-normal">{room.name}</td>
              <td className="px-6 py-4 whitespace-normal">
                {room.cinemaId && room.cinemaId.name
                  ? room.cinemaId.name
                  : "N/A"}
              </td>

              <td className="px-6 py-4 whitespace-normal">
                {room.seatCapacity}
              </td>
              <td className="px-6 py-4 whitespace-normal">{room.screenType}</td>
              <td className="px-6 py-4 whitespace-normal">{room.price}</td>
              <td className="px-6 py-4 whitespace-nowrap flex items-center">
                <button
                  onClick={() => console.log(`Edit room ${room._id}`)}
                  className="text-yellow-400 hover:text-yellow-500 focus:outline-none mr-4"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteRoom(room._id)}
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

export default RoomList;
