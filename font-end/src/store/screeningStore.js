import axios from "axios";
import { create } from "zustand";
import { toast } from "react-hot-toast";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/screening`;
axios.defaults.withCredentials = true;

export const useScreeningStore = create((set) => ({
  screenings: [],
  selectedScreening: null,
  loading: false,
  error: null,

  setScreenings: (screenings) => set({ screenings }),

  fetchAllScreenings: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/`);
      set({ screenings: response.data, loading: false });
    } catch (error) {
      console.error("Failed to fetch screenings:", error);
      set({ loading: false });
    }
  },

  fetchScreeningById: async (screeningId) => {
    try {
      const response = await axios.get(`${API_URL}/${screeningId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch screening details:", error);
      throw error;
    }
  },

  updateSeatStatus: async (screeningId, seatNumber, status) => {
    try {
      const response = await axios.put(
        `${API_URL}/${screeningId}/seats/${seatNumber}`,
        { status }
      );
      toast.success("Seat status updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating seat status:", error);
      toast.error(error.response?.data?.message || "Failed to update seat status");
      throw error;
    }
  },

  updateMultipleSeats: async (screeningId, seats) => {
    try {
      const response = await axios.put(`${API_URL}/${screeningId}/seats`, {
        seats,
      });
      toast.success("Seats updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating multiple seats:", error);
      toast.error(
        error.response?.data?.message || "Failed to update multiple seats"
      );
      throw error;
    }
  },

  getScreeningSeats: async (screeningId) => {
    try {
      const response = await axios.get(`${API_URL}/${screeningId}/seats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching screening seats:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch screening seats"
      );
      throw error;
    }
  },

  fetchScreeningsByRoom: async (roomId) => {
    try {
      const response = await axios.get(`${API_URL}/room/${roomId}`);
      if (!response.data) {
        throw new Error('No screenings data received');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching screenings by room:', error);
      throw error;
    }
  },
}));
