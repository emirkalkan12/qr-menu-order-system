export const mockData = {
  menu: [
    { id: 1, name: 'Classic Burger', price: 12.99, category: 'Main Dishes', description: 'Juicy beef patty with fresh vegetables', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Caesar Salad', price: 8.99, category: 'Appetizers', description: 'Fresh romaine lettuce with caesar dressing', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Chocolate Cake', price: 6.99, category: 'Desserts', description: 'Rich chocolate cake with fudge frosting', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Pizza Margherita', price: 14.99, category: 'Main Dishes', description: 'Classic Italian pizza with tomatoes and mozzarella', image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Ice Cream', price: 5.99, category: 'Desserts', description: 'Vanilla ice cream with chocolate sauce', image: 'https://via.placeholder.com/150' }
  ],
  categories: ['Main Dishes', 'Appetizers', 'Desserts', 'Beverages'],
  orders: [
    {
      id: '#001',
      table: 'Table 1',
      items: [
        { name: 'Classic Burger', quantity: 2, price: 12.99 },
        { name: 'Cola', quantity: 2, price: 2.50 }
      ],
      status: 'pending',
      time: '14:30'
    }
  ]
};

// Mock API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  get: async (url) => {
    await delay(500); // Simulate network delay
    
    if (url.includes('/menu')) {
      return { data: mockData.menu };
    }
    if (url.includes('/categories')) {
      return { data: mockData.categories };
    }
    if (url.includes('/orders')) {
      return { data: mockData.orders };
    }
    throw new Error('Not found');
  },
  
  post: async (url, data) => {
    await delay(500);
    
    if (url.includes('/menu')) {
      const newItem = { id: mockData.menu.length + 1, ...data };
      mockData.menu.push(newItem);
      return { data: newItem };
    }
    if (url.includes('/orders')) {
      const newOrder = { id: '#' + (mockData.orders.length + 1).toString().padStart(3, '0'), ...data };
      mockData.orders.push(newOrder);
      return { data: newOrder };
    }
    throw new Error('Not found');
  },
  
  put: async (url, data) => {
    await delay(500);
    
    if (url.includes('/menu/')) {
      const id = parseInt(url.split('/').pop());
      const index = mockData.menu.findIndex(item => item.id === id);
      if (index !== -1) {
        mockData.menu[index] = { ...mockData.menu[index], ...data };
        return { data: mockData.menu[index] };
      }
    }
    throw new Error('Not found');
  },
  
  delete: async (url) => {
    await delay(500);
    
    if (url.includes('/menu/')) {
      const id = parseInt(url.split('/').pop());
      const index = mockData.menu.findIndex(item => item.id === id);
      if (index !== -1) {
        mockData.menu.splice(index, 1);
        return { data: { success: true } };
      }
    }
    throw new Error('Not found');
  },
  
  patch: async (url, data) => {
    await delay(500);
    
    if (url.includes('/orders/')) {
      const id = url.split('/')[2];
      const order = mockData.orders.find(o => o.id === id);
      if (order) {
        order.status = data.status;
        return { data: order };
      }
    }
    throw new Error('Not found');
  }
};
