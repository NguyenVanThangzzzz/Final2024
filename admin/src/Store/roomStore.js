import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = `${process.env.REACT_APP_API_URL}/api/room`;

export const useRoomStore = create((set) => ({
  rooms: [],
  loading: false,
  error: null,

  // Fetch all rooms
  fetchAllRooms: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}`, {
        withCredentials: true,
      });
      set({ rooms: response.data.rooms });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      set({ error: error.message });
      toast.error("Failed to fetch rooms");
    } finally {
      set({ loading: false });
    }
  },

  // Create room
  createRoom: async (roomData) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        `${API_URL}`,
        roomData,
        { withCredentials: true }
      );
      set((state) => ({
        rooms: [...state.rooms, response.data],
      }));
      toast.success("Room created successfully");
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error(error.response?.data?.message || "Failed to create room");
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Update room
  updateRoom: async (roomId, roomData) => {
    set({ loading: true });
    try {
      const response = await axios.put(
        `${API_URL}/${roomId}`,
        roomData,
        { withCredentials: true }
      );
      set((state) => ({
        rooms: state.rooms.map((room) =>
          room._id === roomId ? response.data : room
        ),
      }));
      toast.success("Room updated successfully");
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Delete room
  deleteRoom: async (roomId) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/${roomId}`, {
        withCredentials: true,
      });
      set((state) => ({
        rooms: state.rooms.filter((room) => room._id !== roomId),
      }));
      toast.success("Room deleted successfully");
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error(error.response?.data?.message || "Failed to delete room");
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
