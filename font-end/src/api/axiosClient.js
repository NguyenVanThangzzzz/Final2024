import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor để xử lý refresh token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/refresh-token`,
          {},
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        // Thử lại request ban đầu
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại, logout user
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient; 