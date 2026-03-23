const mongoose = require('mongoose');

const PartnerRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    outletName: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Reviewed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('PartnerRequest', PartnerRequestSchema);
