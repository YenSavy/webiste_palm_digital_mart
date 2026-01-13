import axios, {type AxiosInstance, AxiosError,type InternalAxiosRequestConfig,type AxiosResponse } from 'axios';
import { getAuthToken } from '../store/authStore';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'https://api.example.com',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken()
      
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized access');
          break;
        case 403:
          console.error('Forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('An error occurred:', error.message);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;





