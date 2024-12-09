import { motion } from "framer-motion";
import { Edit3, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useRoomStore } from "../../Store/roomStore";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import EditRoomForm from "./EditRoomForm";

const RoomList = () => {
  const { deleteRoom, rooms, fetchAllRooms } = useRoomStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchAllRooms();
  }, [fetchAllRooms]);

  const handleDeleteClick = (roomId) => {
    setSelectedRoomId(roomId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedRoomId) {
      await deleteRoom(selectedRoomId);
      setIsConfirmOpen(false);
      setSelectedRoomId(null);
    }
  };

  const handleEditClick = (room) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRoom(null);
  };

  return (
    <>
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
                Screen Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Room Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Cinema
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {rooms?.map((room) => (
              <tr key={room._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">{room.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{room.screenType}</td>
                <td className="px-6 py-4 whitespace-nowrap">{room.roomType}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {room.cinemaId?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  <button
                    onClick={() => handleEditClick(room)}
                    className="text-yellow-400 hover:text-yellow-500 focus:outline-none mr-4"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(room._id)}
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

      {isEditModalOpen && selectedRoom && (
        <EditRoomForm room={selectedRoom} onClose={handleCloseEditModal} />
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
      />
    </>
  );
};

export default RoomList;
