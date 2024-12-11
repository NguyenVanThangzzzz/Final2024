import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/movie`;
axios.defaults.withCredentials = true;

export const useMovieStore = create((set) => ({
  movies: [],
  loading: false,
  error: null,

  setMovies: (movies) => set({ movies }),

  fetchAllMovies: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/`);
      if (response && response.data) {
        set({ 
          movies: response.data.movies || [], 
          loading: false,
          error: null 
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      set({ 
        movies: [],
        error: error.message || "Failed to fetch movies", 
        loading: false 
      });
      toast.error(error.message || "Failed to fetch movies");
    }
  },
}));
