import axios from "axios";
import { create } from "zustand";

const API_URL = "http://localhost:8080/api/admin";
axios.defaults.withCredentials = true;

export const useAdminStore = create((set, get) => ({
  admin: null,
  users: [],
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

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      set({ admin: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  getUsers: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/users`);
      set({ users: response.data.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Get users error:", error);
    }
  },

  createUser: async (userData) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      set((state) => ({
        users: [...state.users, response.data.data],
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    set({ loading: true });
    try {
      const response = await axios.put(`${API_URL}/users/${userId}`, userData);
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? { ...user, ...response.data.user } : user
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  searchUsers: async (query) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/users/search`, {
        params: query,
      });
      set({ users: response.data.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Search users error:", error);
    }
  },

  assignRole: async (userId, role) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${API_URL}/assign-role`, {
        userId,
        role,
      });
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId
            ? { ...user, role: response.data.user.role }
            : user
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
