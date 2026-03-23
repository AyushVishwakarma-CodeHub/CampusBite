const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    outletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outlet', required: true },
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Preparing', 'Ready', 'Completed'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    pickupType: { type: String, enum: ['Takeaway', 'Delivery'], required: true },
    timeSlot: { type: String, required: true }, // e.g., '1:00 PM - 1:10 PM'
    tokenNumber: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
