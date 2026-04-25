const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String },
    googleId: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ['student', 'outlet', 'admin'], default: 'student' },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
