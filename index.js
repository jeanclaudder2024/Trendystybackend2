const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require("./Routes/authRoutes");
const itemRoutes = require("./Routes/ItemRoutes");
const pageContentRoutes = require("./Routes/pageContentRoutes");
const shippingImageRoutes = require('./Routes/shippingImagesRoutes');

const app = express();
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://trendysty-dashboard.netlify.app',
    'https://trendysty-website.netlify.app'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Mount routes
app.use('/api/items', itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pages", pageContentRoutes);
app.use('/api/shipping-images', shippingImageRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Trendysty Backend API is running!' });
});

// For local development
if (require.main === module) {
    app.listen(process.env.PORT || 5000, () => {
        console.log('🚀 Server is running on port', process.env.PORT || 5000);
    });
}

module.exports = app;