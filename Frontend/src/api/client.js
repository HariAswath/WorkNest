import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api/v1`
  : '/api/v1';

export const apiClient = axios.create({
  baseURL: apiBase,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('worknest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format error messages nicely
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'Something went wrong. Please try again.',
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors || [],
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
