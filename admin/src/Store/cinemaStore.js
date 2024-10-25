import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";
const API_URL = "http://localhost:8080/api/cinema";
axios.defaults.withCredentials = true;

export const useCinemaStore = create((set) => ({
  cinemas: [],
  loading: false,

  setCinemas: (cinemas) => set({ cinemas }),

  createCinema: async (cinemaData) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${API_URL}/`, cinemaData);
      set((prevState) => ({
        cinemas: [...prevState.cinemas, res.data.cinema],
        loading: false,
      }));
      toast.success("Cinema created successfully!");
    } catch (error) {
      toast.error(error.response.data.message || "Failed to create cinema");
      set({ loading: false });
    }
  },

  fetchAllCinemas: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/`);
      set({ cinemas: response.data.cinemas, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch cinemas", loading: false });
      toast.error(error.response.data.message || "Failed to fetch cinemas");
    }
  },

  deleteCinema: async (cinemaId) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/${cinemaId}`);
      set((prevCinemas) => ({
        cinemas: prevCinemas.cinemas.filter(
          (cinema) => cinema._id !== cinemaId
        ),
        loading: false,
      }));
      toast.success("Cinema deleted successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "Failed to delete cinema");
    }
  },
}));
