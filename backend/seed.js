const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const products = [
    // Featured Products
    {
        id: "1",
        name: "Cartoon Astronaut T-Shirt",
        price: 78,
        image: "img/products/f1.jpg",
        brand: "Adidas",
        category: "T-Shirts",
        isFeatured: true,
        isNewArrival: false
    },
    {
        id: "2",
        name: "Cartoon Astronaut T-Shirt",
        price: 78,
        image: "img/products/f2.jpg",
        brand: "Adidas",
        category: "T-Shirts",
        isFeatured: true,
        isNewArrival: false
    },
    {
        id: "3",
        name: "Cartoon Astronaut T-Shirt",
        price: 78,
        image: "img/products/f3.jpg",
        brand: "Adidas",
        category: "T-Shirts",
        isFeatured: true,
        isNewArrival: false
    },
    {
        id: "4",
        name: "Cartoon Astronaut T-Shirt",
        price: 78,
        image: "img/products/f4.jpg",
        brand: "Adidas",
        category: "T-Shirts",
        isFeatured: true,
        isNewArrival: false
    },
    {
        id: "5",
        name: "Cartoon Astronaut T-Shirt",
        price: 78,
        image: "img/products/f5.jpg",
        brand: "Adidas",
        category: "T-Shirts",
        isFeatured: true,
        isNewArrival: false
    },
    {
        id: "6",
        name: "Floral Print T-Shirt",
        price: 78,
        image: "img/products/f6.jpg",
        brand: "Adidas",
        category: "T-Shirts",
        isFeatured: true,
        isNewArrival: false
    },
    {
        id: "7",
        name: "Cartoon Astronaut T-Shirt",
        price: 78,
        image: "img/products/f7.jpg",
        brand: "Adidas",
        category: "T-Shirts",
        isFeatured: true,
        isNewArrival: false
    },
    // New Arrivals
    {
        id: "8",
        name: "Blue Pattern Shirt",
        price: 78,
        image: "img/products/n1.jpg",
        brand: "Nike",
        category: "Shirts",
        isFeatured: false,
        isNewArrival: true
    },
    {
        id: "9",
        name: "Blue Pattern Shirt",
        price: 78,
        image: "img/products/n2.jpg",
        brand: "Nike",
        category: "Shirts",
        isFeatured: false,
        isNewArrival: true
    },
    {
        id: "10",
        name: "Blue Pattern Shirt",
        price: 78,
        image: "img/products/n3.jpg",
        brand: "Nike",
        category: "Shirts",
        isFeatured: false,
        isNewArrival: true
    },
    {
        id: "11",
        name: "Blue Pattern Shirt",
        price: 78,
        image: "img/products/n4.jpg",
        brand: "Nike",
        category: "Shirts",
        isFeatured: false,
        isNewArrival: true
    },
    {
        id: "12",
        name: "Blue Pattern Shirt",
        price: 78,
        image: "img/products/n5.jpg",
        brand: "Nike",
        category: "Shirts",
        isFeatured: false,
        isNewArrival: true
    },
    {
        id: "13",
        name: "Blue Pattern Shirt",
        price: 78,
        image: "img/products/n6.jpg",
        brand: "Nike",
        category: "Shirts",
        isFeatured: false,
        isNewArrival: true
    },
    {
        id: "14",
        name: "Blue Pattern Shirt",
        price: 78,
        image: "img/products/n7.jpg",
        brand: "Nike",
        category: "Shirts",
        isFeatured: false,
        isNewArrival: true
    }
];

async function seedDatabase() {
    try {
        // Clear existing products (optional, comment out if you want to keep existing data)
        await Product.deleteMany({});
        console.log('Existing products cleared');

        // Insert all products
        await Product.insertMany(products);
        console.log('All products added successfully');

        // Close the connection
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

seedDatabase();