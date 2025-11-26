import axios, {type AxiosInstance, AxiosError,type InternalAxiosRequestConfig,type AxiosResponse } from 'axios';

const axiosErpInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ERP_URL || 'https://api.example.com',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosErpInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosErpInstance.interceptors.response.use(
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

export default axiosErpInstance;





