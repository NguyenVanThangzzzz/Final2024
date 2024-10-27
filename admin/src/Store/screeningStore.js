import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";

const API_URL = "http://localhost:8080/api/screening";
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
      toast.error(error.response.data.message || "Failed to create screening");
      set({ loading: false });
    }
  },

  fetchAllScreenings: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/`);
      set({ screenings: response.data, loading: false }); // Set the entire response as screenings
    } catch (error) {
      console.error("Failed to fetch screenings:", error);
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
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to delete screening:", error);
      set({ loading: false });
    }
  },
}));
