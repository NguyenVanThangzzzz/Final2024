import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";

const API_URL = `${process.env.REACT_APP_API_URL}/api/screening`;
axios.defaults.withCredentials = true;

export const useScreeningStore = create((set) => ({
  screenings: [],
  loading: false,

  setScreenings: (screenings) => set({ screenings }),

  createScreening: async (screeningData) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/`, screeningData);
      await useScreeningStore.getState().fetchAllScreenings();
      toast.success("Screening created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create screening");
    } finally {
      set({ loading: false });
    }
  },

  fetchAllScreenings: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/`);
      set({ screenings: response.data, loading: false });
    } catch (error) {
      console.error("Failed to fetch screenings:", error);
      toast.error("Failed to fetch screenings");
    } finally {
      set({ loading: false });
    }
  },

  deleteScreening: async (screeningId) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/${screeningId}`);
      set((state) => ({
        screenings: state.screenings.filter(
          (screening) => screening._id !== screeningId
        ),
      }));
      toast.success("Screening deleted successfully");
    } catch (error) {
      console.error("Failed to delete screening:", error);
      toast.error("Failed to delete screening");
    } finally {
      set({ loading: false });
    }
  },

  updateScreening: async (id, data) => {
    try {
      set({ loading: true });
      const response = await axios.put(`${API_URL}/${id}`, data);
      set(state => ({
        screenings: state.screenings.map(screening => 
          screening._id === id ? response.data : screening
        )
      }));
      return response.data;
    } catch (error) {
      console.error("Failed to update screening:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
