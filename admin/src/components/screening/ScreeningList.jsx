import { motion } from "framer-motion";
import { Edit3, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useScreeningStore } from "../../Store/screeningStore";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import EditScreeningForm from "./EditScreeningForm";

const ScreeningList = () => {
  const { deleteScreening, screenings, fetchAllScreenings } = useScreeningStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedScreeningId, setSelectedScreeningId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedScreening, setSelectedScreening] = useState(null);

  useEffect(() => {
    fetchAllScreenings();
  }, [fetchAllScreenings]);

  const handleDeleteClick = (screeningId) => {
    setSelectedScreeningId(screeningId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedScreeningId) {
      await deleteScreening(selectedScreeningId);
      setIsConfirmOpen(false);
      setSelectedScreeningId(null);
    }
  };

  const handleEditClick = (screening) => {
    if (screening && screening.movieId && screening.roomId) {
      setSelectedScreening({
        ...screening,
        movieId: {
          _id: screening.movieId._id,
          name: screening.movieId.name
        },
        roomId: {
          _id: screening.roomId._id,
          name: screening.roomId.name,
          cinemaId: screening.roomId.cinemaId
        }
      });
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedScreening(null);
    fetchAllScreenings();
  };

  return (
    <>
      <motion.div
        className="bg-gray-800 shadow-lg rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Movie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Cinema
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Show Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                End Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Seat Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {screenings?.map((screening) => (
              <tr key={screening._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  {screening.movieId?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {screening.roomId?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {screening.roomId?.cinemaId?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(screening.showTime).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(screening.endTime).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${screening.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {screening.seatCapacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  <button
                    onClick={() => handleEditClick(screening)}
                    className="text-yellow-400 hover:text-yellow-500 focus:outline-none mr-4"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(screening._id)}
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

      {isEditModalOpen && selectedScreening && (
        <EditScreeningForm
          screening={selectedScreening}
          onClose={handleCloseEditModal}
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Screening"
        message="Are you sure you want to delete this screening? This action cannot be undone."
      />
    </>
  );
};

export default ScreeningList;
