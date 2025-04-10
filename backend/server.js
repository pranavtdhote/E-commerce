const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));


// Serve images from 'frontend/img' directory
app.use('/img', express.static(path.join(__dirname, '../frontend/img')));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api', require('./routes/index')); 
app.use('/api/contact', require('./routes/contact'));
app.use('/api/blogs', require('./routes/blog')); 

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));