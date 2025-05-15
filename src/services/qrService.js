export const qrService = {
  generateQRCode: (tableId) => {
    // Generate a simple URL for the table
    const qrData = `http://localhost:3000/menu?table=${tableId}`;
    return Promise.resolve({ qrData });
  },

  getTableQRCode: (tableId) => {
    const qrData = `http://localhost:3000/menu?table=${tableId}`;
    return Promise.resolve({ qrData });
  },

  validateQRCode: (qrCode) => {
    // Simple validation - check if it contains our domain
    const isValid = qrCode.includes('localhost:3000');
    return Promise.resolve({ isValid });
  },
};
