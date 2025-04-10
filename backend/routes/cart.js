const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Get cart
router.get('/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            cart = new Cart({ userId: req.params.userId, items: [] });
            await cart.save();
        }

        
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add to cart
router.post('/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            cart = new Cart({ userId: req.params.userId, items: [] });
        }

        const { productId, name, price, image } = req.body;
        const existingItem = cart.items.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ productId, name, price, image, quantity: 1 });
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update cart item quantity
router.put('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        const { productId, quantity } = req.body;

        const item = cart.items.find(item => item.productId === productId);
        if (item) {
            if (quantity <= 0) {
                cart.items = cart.items.filter(i => i.productId !== productId);
            } else {
                item.quantity = quantity;
            }
            await cart.save();
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove item from cart
router.delete('/:userId/:productId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        cart.items = cart.items.filter(item => item.productId !== req.params.productId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;