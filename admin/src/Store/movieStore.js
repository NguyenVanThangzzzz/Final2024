import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";

const API_URL = `${process.env.REACT_APP_API_URL}/api/movie`;
axios.defaults.withCredentials = true;

export const useMovieStore = create((set) => ({
  movies: [],
  loading: false,
  error: null,

  setMovies: (movies) => set({ movies }),
  createMovie: async (movieData) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        `${API_URL}`,
        movieData,
        { withCredentials: true }
      );
      set((state) => ({
        movies: [...state.movies, response.data.movie],
      }));
      toast.success(response.data.message || "Movie created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create movie");
      console.error("Error creating movie:", error);
    } finally {
      set({ loading: false });
    }
  },
  updateMovie: async (id, movieData) => {
    set({ loading: true });
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        movieData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        set((state) => ({
          movies: state.movies.map((movie) =>
            movie._id === id ? response.data.movie : movie
          ),
        }));
        toast.success(response.data.message);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update movie";
      toast.error(errorMessage);
      console.error("Error updating movie:", error);
    } finally {
      set({ loading: false });
    }
  },
  deleteMovie: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.delete(
        `${API_URL}/${id}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        set((state) => ({
          movies: state.movies.filter((movie) => movie._id !== id),
        }));
        toast.success(response.data.message || "Movie deleted successfully");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete movie";
      toast.error(errorMessage);
      console.error("Error deleting movie:", error);
    } finally {
      set({ loading: false });
    }
  },
  fetchAllMovies: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}`, {
        withCredentials: true,
      });
      set({ movies: response.data.movies });
    } catch (error) {
      toast.error("Failed to fetch movies");
      console.error("Error fetching movies:", error);
    } finally {
      set({ loading: false });
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
