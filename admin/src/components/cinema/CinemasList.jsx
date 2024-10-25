import { motion } from "framer-motion";
import { Edit3, Trash } from "lucide-react"; // Icons for delete and edit actions
import { useEffect } from "react";
import { useCinemaStore } from "../../Store/cinemaStore";

const CinemasList = () => {
  const { deleteCinema, cinemas, fetchAllCinemas } = useCinemaStore();

  useEffect(() => {
    fetchAllCinemas();
  }, [fetchAllCinemas]);

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
          {cinemas?.map((cinema) => (
            <tr key={cinema._id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={cinema.image}
                  alt={cinema.name}
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
                  onClick={() => console.log(`Edit cinema ${cinema._id}`)}
                  className="text-yellow-400 hover:text-yellow-500 focus:outline-none mr-4"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                {/* Delete Action */}
                <button
                  onClick={() => deleteCinema(cinema._id)}
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

export default CinemasList;
