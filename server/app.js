const express = require('express');
const cors = require('cors');
const { sql, connectDB } = require('./config/database');
const router = express.Router();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database bağlantısı
connectDB();

// API Routes setup
const setupRoutes = () => {
    // Menü öğelerini getir
    router.get('/menu', async (req, res) => {
        try {
            const result = await sql.query`SELECT * FROM MenuItems`;
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Kategorileri getir
    router.get('/categories', async (req, res) => {
        try {
            const result = await sql.query`SELECT * FROM Categories`;
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Siparişleri getir
    router.get('/orders', async (req, res) => {
        try {
            const orders = await sql.query`
                SELECT o.*, oi.* 
                FROM Orders o
                LEFT JOIN OrderItems oi ON o.Id = oi.OrderId
                ORDER BY o.CreatedAt DESC
            `;
            
            const orderMap = new Map();
            orders.recordset.forEach(row => {
                if (!orderMap.has(row.Id)) {
                    orderMap.set(row.Id, {
                        id: row.Id,
                        tableNumber: row.TableNumber,
                        status: row.Status,
                        totalAmount: row.TotalAmount,
                        createdAt: row.CreatedAt,
                        updatedAt: row.UpdatedAt,
                        items: []
                    });
                }
                if (row.MenuItemId) {
                    orderMap.get(row.Id).items.push({
                        id: row.MenuItemId,
                        name: row.Name,
                        quantity: row.Quantity,
                        price: row.Price
                    });
                }
            });

            res.json(Array.from(orderMap.values()));
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Yeni sipariş oluştur
    router.post('/orders', async (req, res) => {
        try {
            const { tableNumber, items, status, totalAmount } = req.body;
            
            const orderResult = await sql.query`
                INSERT INTO Orders (TableNumber, Status, TotalAmount, CreatedAt)
                OUTPUT INSERTED.Id
                VALUES (${tableNumber}, ${status}, ${totalAmount}, GETDATE())
            `;
            
            const orderId = orderResult.recordset[0].Id;
            
            for (const item of items) {
                await sql.query`
                    INSERT INTO OrderItems (OrderId, MenuItemId, Name, Quantity, Price)
                    VALUES (${orderId}, ${item.menuItemId}, ${item.name}, ${item.quantity}, ${item.price})
                `;
            }

            res.json({ success: true, orderId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Sipariş durumunu güncelle
    router.put('/orders/:id/status', async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            await sql.query`
                UPDATE Orders 
                SET Status = ${status}, UpdatedAt = GETDATE()
                WHERE Id = ${id}
            `;

            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};

// Routes
app.use('/api', setupRoutes());

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Bir hata oluştu!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});
