import axios from "axios";
import { create } from "zustand";

const API_URL = "http://localhost:8080/api/admin";
axios.defaults.withCredentials = true;

export const useAdminStore = create((set, get) => ({
  user: null,
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
      set({ user: response.data, loading: false }); // Cập nhật user sau khi đăng nhập
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null }); // Đặt user về null khi đăng xuất
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // checkAuth: async () => {
  //   set({ checkingAuth: true });
  //   try {
  //     const response = await axios.get(`${API_URL}/profile`);
  //     // Kiểm tra xem người dùng có vai trò admin không
  //     if (response.data.role === "admin") {
  //       set({ user: response.data, checkingAuth: false });
  //     } else {
  //       set({ checkingAuth: false, user: null }); // Nếu không phải admin, đặt user về null
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //     set({ checkingAuth: false, user: null });
  //   }
  // },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get(`${API_URL}/profile`);
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.log(error.message);
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post(`${API_URL}/refresh-token`);
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
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

// TODO: Implement the axios interceptors for refreshing access token

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useAdminStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useAdminStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
