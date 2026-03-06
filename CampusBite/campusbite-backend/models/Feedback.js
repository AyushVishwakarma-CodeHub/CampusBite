const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    outletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outlet', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
