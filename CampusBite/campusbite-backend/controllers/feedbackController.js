const Feedback = require('../models/Feedback');
const Order = require('../models/Order');

const submitFeedback = async (req, res) => {
    try {
        const { orderId, rating, comments } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.studentId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to review this order' });
        }

        if (order.status !== 'Completed') {
            return res.status(400).json({ message: 'Can only rate completed orders' });
        }

        // Check if feedback already exists
        const existingFeedback = await Feedback.findOne({ orderId });
        if (existingFeedback) {
            return res.status(400).json({ message: 'Feedback already submitted for this order' });
        }

        const feedback = await Feedback.create({
            orderId,
            studentId: req.user.id,
            outletId: order.outletId,
            rating,
            comments
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOutletFeedback = async (req, res) => {
    try {
        const feedbackList = await Feedback.find({ outletId: req.params.outletId })
            .populate('studentId', 'name')
            .sort({ createdAt: -1 });
        res.json(feedbackList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check if a specific order has feedback
const checkOrderFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findOne({ orderId: req.params.orderId });
        res.json({ hasFeedback: !!feedback, feedback });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { submitFeedback, getOutletFeedback, checkOrderFeedback };
