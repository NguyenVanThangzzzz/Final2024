import { motion } from "framer-motion";
import { Edit3, Trash } from "lucide-react"; // Icons for delete and edit actions
import { useEffect, useState } from "react";
import { useCinemaStore } from "../../Store/cinemaStore";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import EditCinemaForm from './EditCinemaForm';

const CinemasList = () => {
  const { deleteCinema, cinemas, fetchAllCinemas } = useCinemaStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState(null);

  useEffect(() => {
    fetchAllCinemas();
  }, [fetchAllCinemas]);

  const handleDeleteClick = (cinemaId) => {
    setSelectedCinemaId(cinemaId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCinemaId) {
      await deleteCinema(selectedCinemaId);
      setIsConfirmOpen(false);
      setSelectedCinemaId(null);
    }
  };

  const handleEditClick = (cinema) => {
    setSelectedCinema(cinema);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCinema(null);
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
                Cinema
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                style={{ width: "15%" }}
              >
                Country
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                style={{ width: "15%" }}
              >
                State
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                style={{ width: "20%" }}
              >
                Street Name
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                style={{ width: "10%" }}
              >
                Postal Code
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                style={{ width: "10%" }}
              >
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {cinemas?.map((cinema) => cinema && (
              <tr key={cinema._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={cinema.image || '/placeholder-image.jpg'}
                    alt={cinema.name || 'Cinema'}
                  />
                </td>
                <td className="px-6 py-4 whitespace-normal">{cinema.name}</td>
                <td className="px-6 py-4 whitespace-normal">{cinema.country}</td>
                <td className="px-6 py-4 whitespace-normal">{cinema.state}</td>
                <td className="px-6 py-4 whitespace-normal">
                  {cinema.streetName}
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  {cinema.postalCode}
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  {cinema.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  {/* Edit Action */}
                  <button
                    onClick={() => handleEditClick(cinema)}
                    className="text-yellow-400 hover:text-yellow-500 focus:outline-none mr-4"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  {/* Delete Action */}
                  <button
                    onClick={() => handleDeleteClick(cinema._id)}
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

      {isEditModalOpen && selectedCinema && (
        <EditCinemaForm
          cinema={selectedCinema}
          onClose={handleCloseEditModal}
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Cinema"
        message="Are you sure you want to delete this cinema? This action cannot be undone."
      />
    </>
  );
};

export default CinemasList;
