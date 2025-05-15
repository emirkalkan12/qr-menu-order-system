import axios from 'axios';
import { mockApi } from './mockApi';

// Use mockApi instead of real axios for development
const api = process.env.NODE_ENV === 'production' ? 
  axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  }) : mockApi;

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
