const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Path to the blog image (e.g., "img/blog/b1.jpg")
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);