import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";

const API_URL = "http://localhost:8080/api/room";
axios.defaults.withCredentials = true;

export const useRoomStore = create((set) => ({
  rooms: [],
  loading: false,

  screenings: [],

  setRooms: (rooms) => set({ rooms }),
  setSeats: (seats) => set({ seats }),
  setSelectedSeat: (seat) => set({ selectedSeat: seat }),

  fetchAllRooms: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/`);
      console.log("API Response:", response.data);
      if (response.data.rooms && Array.isArray(response.data.rooms)) {
        set({ rooms: response.data.rooms, loading: false });
      } else {
        throw new Error("Invalid room data format");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      set({ error: "Failed to fetch rooms", loading: false });
      toast.error(error.response?.data?.message || "Failed to fetch rooms");
    }
  },

  // Thêm phương thức mới để lấy phòng theo cinemaId
  fetchRoomsByCinema: async (cinemaId) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/cinema/${cinemaId}`);
      set({ rooms: response.data.rooms, loading: false });
      return response;
    } catch (error) {
      set({ error: "Failed to fetch rooms by cinema", loading: false });
      toast.error(
        error.response?.data?.error || "Failed to fetch rooms by cinema"
      );
      return null;
    }
  },

  // Thêm function mới để lấy lịch chiếu theo roomId
  fetchScreeningsByRoom: async (roomId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/screening/room/${roomId}`
      );
      set({ screenings: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching screenings:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch screenings"
      );
      return null;
    }
  },
}));
