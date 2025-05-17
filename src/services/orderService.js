import api from './api';

export const orderService = {
  getAllOrders: async () => {
    return await api.get('/orders');
  },

  getOrderById: async (id) => {
    return await api.get(`/orders/${id}`);
  },

  createOrder: async (order) => {
    return await api.post('/orders', order);
  },

  updateOrderStatus: async (id, status) => {
    return await api.put(`/orders/${id}/status`, status);
  },

  getOrdersByTable: async (tableId) => {
    return await api.get(`/orders/table/${tableId}`);
  }
};
