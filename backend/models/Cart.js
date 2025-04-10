const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Could be session ID or user ID
    items: [cartItemSchema],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', cartSchema);