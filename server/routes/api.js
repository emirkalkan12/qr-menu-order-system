const express = require('express');
const router = express.Router();
const { sql } = require('../config/database');

// Tüm menü öğelerini getir
router.get('/menu', async (req, res) => {
    try {
        const result = await sql.query`select * from MenuItems`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Tüm kategorileri getir
router.get('/categories', async (req, res) => {
    try {
        const result = await sql.query`select * from Categories`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Tüm siparişleri getir
router.get('/orders', async (req, res) => {
    try {
        const result = await sql.query`
            SELECT o.*, oi.* 
            FROM Orders o
            LEFT JOIN OrderItems oi ON o.Id = oi.OrderId
            ORDER BY o.CreatedAt DESC
        `;
        
        // Siparişleri düzenle
        const orders = [];
        const orderMap = new Map();

        result.recordset.forEach(row => {
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
                orders.push(orderMap.get(row.Id));
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

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Yeni sipariş oluştur
router.post('/orders', async (req, res) => {
    try {
        const { tableNumber, items, status, totalAmount } = req.body;

        // Sipariş oluştur
        const orderResult = await sql.query`
            INSERT INTO Orders (TableNumber, Status, TotalAmount, CreatedAt)
            OUTPUT INSERTED.Id
            VALUES (${tableNumber}, ${status}, ${totalAmount}, GETDATE())
        `;
        
        const orderId = orderResult.recordset[0].Id;

        // Sipariş öğelerini ekle
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

module.exports = router;
