const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Get all blog posts
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 }); // Sort by newest first
        res.status(200).json(blogs);
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).json({ message: err.message });
    }
});

// Add a new blog post (for admin use, optional)
router.post('/', async (req, res) => {
    const { title, description, image } = req.body;
    try {
        const blog = new Blog({ title, description, image });
        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        console.error('Error adding blog:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;