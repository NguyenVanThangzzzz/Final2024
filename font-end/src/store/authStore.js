import axios from "axios";
import { create } from "zustand";

const API_URL = "http://localhost:8080/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const reponse = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({ user: reponse.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const reponse = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        user: reponse.data.user,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: "Error Logging out",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, {
        code,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response.data.message || "Error sending reset password email",
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },

  checkAuth: async (force = false) => {
    if (get().isAuthenticated && !force) {
      return;
    }

    set({ isCheckingAuth: true });
    try {
      const response = await axios.get(`${API_URL}/profile`);
      set({
        user: response.data,
        isAuthenticated: true,
        isCheckingAuth: false,
        error: null,
      });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      throw error;
    }
  },

  refreshToken: async () => {
    if (get().isCheckingAuth) return;

    set({ isCheckingAuth: true });
    try {
      const response = await axios.post(`${API_URL}/refresh-token`);
      set({
        isCheckingAuth: false,
        isAuthenticated: true,
        error: null,
      });
      return response.data;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
      throw error;
    }
  },
}));

let refreshPromise = null;
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = useAuthStore.getState().refreshToken();
        }

        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);
