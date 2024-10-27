import { Edit3, Trash } from "lucide-react"; // Import icons for action buttons
import React, { useEffect } from "react";
import { useScreeningStore } from "../../Store/screeningStore";

const ScreeningList = () => {
  const { screenings, loading, fetchAllScreenings, deleteScreening } =
    useScreeningStore();

  useEffect(() => {
    fetchAllScreenings();
  }, [fetchAllScreenings]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-green-500 mb-4">
        Screening List
      </h2>
      {screenings.length > 0 ? (
        <table className="min-w-full bg-gray-800 text-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Movie Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">Room</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                End Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {screenings.map((screening) => (
              <tr
                key={screening._id}
                className="border-t border-gray-700 hover:bg-gray-700"
              >
                <td className="px-6 py-4">
                  {screening.movieId?.name || "N/A"}
                </td>
                <td className="px-6 py-4">{screening.roomId?.name || "N/A"}</td>
                <td className="px-6 py-4">
                  {new Date(screening.showTime).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(screening.endTime).toLocaleString()}
                </td>
                <td className="px-6 py-4 flex items-center">
                  {/* Edit Button */}
                  <button
                    onClick={() =>
                      console.log(`Edit screening ${screening._id}`)
                    }
                    className="text-yellow-400 hover:text-yellow-500 focus:outline-none mr-4"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteScreening(screening._id)}
                    className="text-red-500 hover:text-red-600 focus:outline-none"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400">No screenings available to display</p>
      )}
    </div>
  );
};

export default ScreeningList;
