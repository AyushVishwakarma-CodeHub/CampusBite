const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require("socket.io");

dotenv.config();

// Connect to database is done before starting the server down below

const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:5173',
            'https://campus-bite-seven.vercel.app',
            'https://campusbitelive.vercel.app'
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Make io accessible globally in controllers
app.set('io', io);

io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Client can join a specific room (outletId or studentId)
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});


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
app.use('/api/partner-requests', require('./routes/partnerRequestRoutes'));

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
    server.listen(PORT, () => {
        console.log(`🚀 Backend & WebSocket server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error(`Failed to start server: ${error.message}`);
});
