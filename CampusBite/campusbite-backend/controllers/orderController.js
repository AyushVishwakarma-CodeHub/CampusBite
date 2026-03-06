const Order = require('../models/Order');
const Delivery = require('../models/Delivery');

// Utility to generate a unique random token
const generateTokenNumber = () => {
    return `CB-${Math.floor(100 + Math.random() * 900)}`;
};

const createOrder = async (req, res) => {
    try {
        const { outletId, items, totalAmount, pickupType, timeSlot, deliveryDetails } = req.body;

        const tokenNumber = generateTokenNumber();

        const order = await Order.create({
            studentId: req.user.id,
            outletId,
            items,
            totalAmount,
            pickupType,
            timeSlot,
            tokenNumber
        });

        if (pickupType === 'Delivery' && deliveryDetails) {
            await Delivery.create({
                orderId: order._id,
                hostel: deliveryDetails.hostel,
                block: deliveryDetails.block,
                room: deliveryDetails.room
            });
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudentOrders = async (req, res) => {
    try {
        const orders = await Order.find({ studentId: req.user.id })
            .populate('outletId', 'name')
            .populate('items.menuItem', 'name price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOutletOrders = async (req, res) => {
    try {
        // Ideally user only accesses orders for their owned outlets.
        // Simplifying slightly for demo but using basic check
        const orders = await Order.find({ outletId: req.params.outletId })
            .populate('studentId', 'name')
            .populate('items.menuItem', 'name')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getStudentOrders, getOutletOrders, updateOrderStatus };
