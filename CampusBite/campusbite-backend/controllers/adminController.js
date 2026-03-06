const Order = require('../models/Order');
const User = require('../models/User');
const Outlet = require('../models/Outlet');
const axios = require('axios');

// Get total platform analytics
const getAdminAnalytics = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOutlets = await Outlet.countDocuments();

        // Revenue logic: just summing totalAmount across all completed orders for now
        const completedOrders = await Order.find({ status: 'Completed' });
        const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalAmount, 0);

        // Call Python AI service for demand prediction (Demo: using first outlet)
        // Call Python AI service for demand prediction for all approved outlets
        let aiPredictions = [];
        const activeOutlets = await Outlet.find({ isApproved: true }).limit(5);

        for (const outlet of activeOutlets) {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/predict?outletId=${outlet.name}&date=${new Date().toISOString()}`);
                aiPredictions.push({
                    outletId: outlet.name,
                    predictedOrders: response.data.predictedOrders
                });
            } catch (aiError) {
                aiPredictions.push({ outletId: outlet.name, error: "AI Service Offline" });
            }
        }

        res.json({
            totalOrders,
            totalUsers,
            totalOutlets,
            totalRevenue,
            aiPredictions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAdminAnalytics };
