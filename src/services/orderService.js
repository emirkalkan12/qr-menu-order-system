import { mockData } from './mockApi';

// Local state to manage orders
let orders = [...mockData.orders];
let nextOrderId = orders.length + 1;

export const orderService = {
  getAllOrders: () => {
    return Promise.resolve(orders);
  },

  getOrderById: async (id) => {
    return await api.get(`/orders/${id}`);
  },

  createOrder: async (order) => {
    return await api.post('/orders', order);
  },

  updateOrderStatus: async (id, status) => {
    return await api.patch(`/orders/${id}/status`, { status });
  },

  getOrdersByTable: async (tableId) => {
    return await api.get(`/orders/table/${tableId}`);
  },

  getDailyStats: async () => {
    return await api.get('/orders/stats/daily');
  },
};
