import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";
const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/movie`;
axios.defaults.withCredentials = true;

export const useMovieStore = create((set) => ({
  movies: [],
  loading: false,

  setMovies: (movies) => set({ movies }),

  fetchAllMovies: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/`);
      set({ movies: response.data.movies, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch movies", loading: false });
      toast.error(error.response.data.error || "Failed to fetch movies");
    }
  },
}));
