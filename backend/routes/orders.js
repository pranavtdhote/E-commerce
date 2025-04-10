const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { shipping, payment, items, total } = req.body;

    try {
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const order = new Order({
            userId,
            orderNumber,
            shipping,
            payment,
            items,
            total
        });

        await order.save();
        res.status(201).json({ orderNumber });
    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get order history for a user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // Sort by newest first
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;