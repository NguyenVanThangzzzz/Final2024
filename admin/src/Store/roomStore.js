import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";

const API_URL = "http://localhost:8080/api/room";
axios.defaults.withCredentials = true;

export const useRoomStore = create((set) => ({
  rooms: [],
  loading: false,

  setRooms: (rooms) => set({ rooms }),

  createRoom: async (roomData) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/`, roomData); // Không cần gán vào biến res nếu không sử dụng
      await useRoomStore.getState().fetchAllRooms(); // fetch lại tất cả rooms sau khi tạo thành công
      toast.success("Room created successfully!");
    } catch (error) {
      toast.error(error.response.data.message || "Failed to create room");
      set({ loading: false });
    }
  },

  fetchAllRooms: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/`);
      set({ rooms: response.data.rooms, loading: false });
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      set({ loading: false });
    }
  },

  deleteRoom: async (roomId) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/${roomId}`);
      set((state) => ({
        rooms: state.rooms.filter((room) => room._id !== roomId),
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to delete room:", error);
      set({ loading: false });
    }
  },
}));
