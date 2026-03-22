const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to database is done before starting the server down below

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://campus-bite-seven.vercel.app',
        'https://campusbitelive.vercel.app'
    ],
    credentials: true,
}));
app.use(express.json());
app.use('/public', express.static('public')); // Serve static files

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/outlets', require('./routes/outletRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));


// Temporary admin route to update images
const Outlet = require('./models/Outlet');
app.get('/api/admin/update-images', async (req, res) => {
    const BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000';
    const IMAGE_MAP = {
        'Campus Cafe': `${BASE_URL}/public/images/campus_cafe.png`,
        'Kitchen Ette': `${BASE_URL}/public/images/kitchen_ette.png`,
        'Oven Express': `${BASE_URL}/public/images/oven_express.png`,
        'Campus Fusion': `${BASE_URL}/public/images/campus_fusion.png`,
        'Bengali Bawarchi': `${BASE_URL}/public/images/bengali_bawarchi.png`,
        'Yummy Meals': `${BASE_URL}/public/images/yummy_meals.png`,
        'Punjabi Tadka': `${BASE_URL}/public/images/punjabi_tadka.jpg`
    };
    try {
        let results = [];
        for (const [name, path] of Object.entries(IMAGE_MAP)) {
            const outlet = await Outlet.findOneAndUpdate({ name }, { image: path }, { new: true });
            results.push({ name, updated: !!outlet });
        }
        res.json({ message: "Images updated", results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 8000;

// Connect to database and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error(`Failed to start server: ${error.message}`);
});
