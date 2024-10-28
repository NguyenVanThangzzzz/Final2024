import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";
const API_URL = "http://localhost:8080/api/cinema";
axios.defaults.withCredentials = true;

export const useCinemaStore = create((set) => ({
  cinemas: [],
  loading: false,

  setCinemas: (cinemas) => set({ cinemas }),

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
}));
