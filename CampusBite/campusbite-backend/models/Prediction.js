const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
    outletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outlet', required: true },
    predictedOrders: { type: Number, required: true },
    date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Prediction', PredictionSchema);
