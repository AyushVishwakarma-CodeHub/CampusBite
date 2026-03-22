const Order = require('../models/Order');
const mongoose = require('mongoose');

const getOutletAnalytics = async (req, res) => {
    try {
        const outletId = req.params.outletId;

        // 1. Total Overview Stats
        const overview = await Order.aggregate([
            { $match: { outletId: new mongoose.Types.ObjectId(outletId) } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { 
                        $sum: { $cond: [{ $eq: ["$status", "Completed"] }, "$totalAmount", 0] } 
                    },
                    totalOrders: { $sum: 1 },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
                    },
                    pendingOrders: {
                        $sum: { $cond: [{ $in: ["$status", ["Pending", "Preparing", "Ready"]] }, 1, 0] }
                    }
                }
            }
        ]);

        const stats = overview[0] || { totalRevenue: 0, totalOrders: 0, completedOrders: 0, pendingOrders: 0 };

        // 2. Top Selling Items
        const topItems = await Order.aggregate([
            { $match: { outletId: new mongoose.Types.ObjectId(outletId), status: "Completed" } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.menuItem",
                    totalQuantitySold: { $sum: "$items.quantity" },
                    revenueGenerated: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: 4 },
            {
                $lookup: {
                    from: "menuitems",
                    localField: "_id",
                    foreignField: "_id",
                    as: "menuItemDetails"
                }
            },
            { $unwind: "$menuItemDetails" },
            {
                $project: {
                    name: "$menuItemDetails.name",
                    totalQuantitySold: 1,
                    revenueGenerated: 1
                }
            }
        ]);

        res.json({ stats, topItems });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { getOutletAnalytics };
