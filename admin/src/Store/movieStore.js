import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";
const API_URL = "http://localhost:8080/api/movie";
axios.defaults.withCredentials = true;

export const useMovieStore = create((set) => ({
  movies: [],
  loading: false,

  setMovies: (movies) => set({ movies }),
  createMovie: async (movieData) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${API_URL}/`, movieData);
      set((prevState) => ({
        movies: [...prevState.movies, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },
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
  deleteMovie: async (movieId) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/delete/${movieId}`);
      set((prevMovies) => ({
        movies: prevMovies.movies.filter(
          (movie) => movie._id !== movieId
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete movie");
    }
  },
  toggleFeatured: async (movieId) => {
    try {
      const response = await axios.patch(`${API_URL}/FeaturedMovie/${movieId}`);
      set((state) => ({
        movies: state.movies.map((movie) =>
          movie._id === movieId
            ? { ...movie, isFeatured: !movie.isFeatured }
            : movie
        ),
      }));
      toast.success('Movie featured status updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update featured status');
    }
  },
}));
