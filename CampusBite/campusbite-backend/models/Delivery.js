const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    hostel: { type: String, required: true },
    block: { type: String, required: true },
    room: { type: String, required: true },
    status: { type: String, enum: ['Order Accepted', 'Out for Delivery', 'Delivered'], default: 'Order Accepted' }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', DeliverySchema);
