const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    outletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outlet', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
