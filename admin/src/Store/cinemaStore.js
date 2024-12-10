import axios from "axios";
import { create } from "zustand";
import { toast } from "react-hot-toast";

const API_URL = `${process.env.REACT_APP_API_URL}/api/cinema`;
axios.defaults.withCredentials = true;

export const useCinemaStore = create((set) => ({
  cinemas: [],
  loading: false,
  error: null,
  selectedCinema: null,

  setCinemas: (cinemas) => set({ cinemas }),

  createCinema: async (cinemaData) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        `${API_URL}/`,
        cinemaData,
        { withCredentials: true }
      );
      set((state) => ({
        cinemas: [...state.cinemas, response.data.cinema],
      }));
      toast.success("Cinema created successfully!");
    } catch (error) {
      console.error("Error creating cinema:", error);
      toast.error(error.response?.data?.message || "Error creating cinema");
    } finally {
      set({ loading: false });
    }
  },

  fetchAllCinemas: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/`, {
        withCredentials: true,
      });
      if (response.data && response.data.cinemas) {
        set({ cinemas: response.data.cinemas });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error("Error fetching cinemas:", error);
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteCinema: async (cinemaId) => {
    try {
      await axios.delete(`${API_URL}/${cinemaId}`, {
        withCredentials: true,
      });
      set((prevCinemas) => ({
        cinemas: prevCinemas.cinemas.filter(
          (cinema) => cinema._id !== cinemaId
        ),
      }));
      toast.success("Cinema deleted successfully!");
    } catch (error) {
      console.error("Error deleting cinema:", error);
      toast.error(error.response?.data?.message || "Error deleting cinema");
    }
  },

  setSelectedCinema: (cinema) => set({ selectedCinema: cinema }),

  updateCinema: async (cinemaId, updatedData) => {
    set({ loading: true });
    try {
      const response = await axios.put(
        `${API_URL}/${cinemaId}`,
        updatedData,
        { withCredentials: true }
      );
      
      set((state) => ({
        cinemas: state.cinemas.map((cinema) =>
          cinema._id === cinemaId ? response.data.cinema : cinema
        ),
      }));
      
      return response.data.cinema;
    } catch (error) {
      console.error("Error updating cinema:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
