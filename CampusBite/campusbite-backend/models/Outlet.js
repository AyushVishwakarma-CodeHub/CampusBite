const mongoose = require('mongoose');

const OutletSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved: { type: Boolean, default: false },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    openingTime: { type: String, default: '08:00' },
    closingTime: { type: String, default: '20:00' },
}, { timestamps: true });

module.exports = mongoose.model('Outlet', OutletSchema);

