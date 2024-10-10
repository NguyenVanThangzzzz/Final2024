import axios from "axios";
import { create } from "zustand";

const API_URL = "http://localhost:8080/api/admin";
axios.defaults.withCredentials = true;

export const useAdminStore = create((set, get) => ({
  admin: null,
  loading: false,
  checkingAuth: true,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({ admin: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
