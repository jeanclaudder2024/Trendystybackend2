const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require("./Routes/authRoutes");
const itemRoutes = require("./Routes/itemRoutes");
const pageContentRoutes = require("./Routes/pageContentRoutes");
const shippingImageRoutes = require('./Routes/shippingImagesRoutes');

const app = express();
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001'
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

// ⛔️ Do not use routes until after DB connects

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('✅ Connected to MongoDB');

        // ✅ Mount routes *after* DB connection
        app.use('/api/items', itemRoutes);
        app.use("/api/auth", authRoutes);
        app.use("/api/pages", pageContentRoutes);
        app.use('/api/shipping-images', shippingImageRoutes);

        app.listen(process.env.PORT || 5000, () => {
            console.log('🚀 Server is running');
        });
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));