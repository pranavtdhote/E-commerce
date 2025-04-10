const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get featured products
router.get('/featured-products', async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).limit(8);
        res.json(featuredProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get new arrivals
router.get('/new-arrivals', async (req, res) => {
    try {
        const newArrivals = await Product.find({ isNewArrival: true }).limit(8);
        res.json(newArrivals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;