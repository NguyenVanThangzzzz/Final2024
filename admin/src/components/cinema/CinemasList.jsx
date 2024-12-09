import { motion } from "framer-motion";
import { Edit3, Trash, Building2, Pencil, Trash2 } from "lucide-react"; // Icons for delete and edit actions
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
        className="bg-gray-800 shadow-lg rounded-lg overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Cinema
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Country
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  State
                </th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Street Name
                </th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Postal Code
                </th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {cinemas?.map((cinema) => cinema && (
                <tr key={cinema._id} className="hover:bg-gray-700">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <img
                      className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
                      src={cinema.image || '/placeholder-image.jpg'}
                      alt={cinema.name || 'Cinema'}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-normal">
                    <div className="text-sm md:text-base">{cinema.name}</div>
                    {/* Show mobile-only details */}
                    <div className="md:hidden text-xs text-gray-400">
                      {cinema.country}, {cinema.state}
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-4 py-4 whitespace-normal">
                    {cinema.country}
                  </td>
                  <td className="hidden md:table-cell px-4 py-4 whitespace-normal">
                    {cinema.state}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-normal">
                    {cinema.streetName}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-normal">
                    {cinema.postalCode}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-normal">
                    {cinema.phoneNumber}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEditClick(cinema)}
                        className="text-yellow-400 hover:text-yellow-500 focus:outline-none"
                      >
                        <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cinema._id)}
                        className="text-red-500 hover:text-red-600 focus:outline-none"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
