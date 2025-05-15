import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const menuService = {
  getAllItems: async () => {
    try {
      const response = await axios.get(`${API_URL}/menu`);
      return response.data;
    } catch (error) {
      console.error('Menü verileri alınamadı:', error);
      throw error;
    }
  },

  getItemById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/menu/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ürün detayları alınamadı:', error);
      throw error;
    }
  },

  createItem: async (item) => {
    try {
      const response = await axios.post(`${API_URL}/menu`, item);
      return response.data;
    } catch (error) {
      console.error('Ürün eklenemedi:', error);
      throw error;
    }
  },

  updateItem: async (id, item) => {
    try {
      const response = await axios.put(`${API_URL}/menu/${id}`, item);
      return response.data;
    } catch (error) {
      console.error('Ürün güncellenemedi:', error);
      throw error;
    }
  },

  deleteItem: async (id) => {
    try {
      await axios.delete(`${API_URL}/menu/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Ürün silinemedi:', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Kategoriler alınamadı:', error);
      throw error;
    }
  },

  getItemsByCategory: async (category) => {
    try {
      const response = await axios.get(`${API_URL}/menu?category=${category}`);
      return response.data;
    } catch (error) {
      console.error('Kategori ürünleri alınamadı:', error);
      throw error;
    }
  }
};
