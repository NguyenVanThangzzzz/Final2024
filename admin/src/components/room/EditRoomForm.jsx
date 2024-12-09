import { motion } from "framer-motion";
import { Loader, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRoomStore } from "../../Store/roomStore";
import { useCinemaStore } from "../../Store/cinemaStore";
import { SCREEN_TYPES, ROOM_TYPES } from "../../constants/roomConstants";

const EditRoomForm = ({ room, onClose }) => {
  const { updateRoom, loading } = useRoomStore();
  const { cinemas, fetchAllCinemas } = useCinemaStore();
  
  const [formData, setFormData] = useState({
    name: "",
    screenType: "",
    roomType: "",
    cinemaId: "",
  });

  useEffect(() => {
    fetchAllCinemas();
  }, [fetchAllCinemas]);

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || "",
        screenType: room.screenType || "",
        roomType: room.roomType || "",
        cinemaId: room.cinemaId?._id || room.cinemaId || "",
      });
    }
  }, [room]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name?.trim()) {
      toast.error("Room name is required");
      return;
    }
    if (!formData.screenType) {
      toast.error("Screen type is required");
      return;
    }
    if (!formData.roomType) {
      toast.error("Room type is required");
      return;
    }
    if (!formData.cinemaId) {
      toast.error("Cinema is required");
      return;
    }

    try {
      await updateRoom(room._id, formData);
      onClose();
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-gray-800 rounded-lg p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
          Edit Room
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Room Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              required
            />
          </div>

          {/* Cinema Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Cinema <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.cinemaId}
              onChange={(e) => setFormData({ ...formData, cinemaId: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
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

          {/* Screen Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Screen Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.screenType}
              onChange={(e) => setFormData({ ...formData, screenType: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
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

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Room Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.roomType}
              onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
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

export default EditRoomForm; 