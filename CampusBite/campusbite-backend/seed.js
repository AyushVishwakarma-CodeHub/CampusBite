/**
 * CampusBite Database Seed Script
 * Run: node seed.js
 * 
 * Creates:
 *  - 1 Admin user
 *  - 1 Outlet Owner user  (+ their outlet, pre-approved)
 *  - 2 Student users
 *  - 5 Menu items for the outlet
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Outlet = require('./models/Outlet');
const MenuItem = require('./models/MenuItem');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Outlet.deleteMany({});
        await MenuItem.deleteMany({});
        console.log('🗑️  Cleared existing data');

        const saltRounds = 10;
        const password = await bcrypt.hash('password123', saltRounds);

        // --- Create Users ---
        const admin = await User.create({
            name: 'Campus Admin',
            email: 'admin@campusbite.com',
            password_hash: password,
            role: 'admin',
        });

        const outletOwner = await User.create({
            name: 'Rahul Sharma',
            email: 'owner@campusbite.com',
            password_hash: password,
            role: 'outlet',
        });

        await User.create({
            name: 'Priya Singh',
            email: 'priya@lpu.edu',
            password_hash: password,
            role: 'student',
        });

        await User.create({
            name: 'Ayush Kumar',
            email: 'ayush@lpu.edu',
            password_hash: password,
            role: 'student',
        });

        console.log('👤 Created 4 users (1 admin, 1 outlet owner, 2 students)');

        // --- Create Outlet ---
        const outlet = await Outlet.create({
            name: 'Punjabi Tadka',
            description: 'Authentic Punjabi street food — parathas, chole bhature, lassi and more!',
            location: 'Block 32, Ground Floor',
            openingTime: '08:00',
            closingTime: '20:00',
            ownerId: outletOwner._id,
            isApproved: true,
        });

        console.log('🏪 Created outlet: Punjabi Tadka');

        // --- Create Menu Items ---
        const menuItems = [
            { name: 'Aloo Paratha', description: 'Stuffed whole wheat flatbread served with butter and curd', price: 60, isAvailable: true, image: '/images/aloo_paratha.png' },
            { name: 'Chole Bhature', description: 'Spiced chickpeas with fluffy deep-fried bread', price: 80, isAvailable: true, image: '/images/chole_bhature.png' },
            { name: 'Paneer Butter Masala', description: 'Cottage cheese in a rich tomato-based gravy', price: 120, isAvailable: true, image: '/images/paneer_butter_masala.png' },
            { name: 'Sweet Lassi', description: 'Refreshing yogurt-based chilled drink', price: 40, isAvailable: true, image: '/images/sweet_lassi.png' },
            { name: 'Masala Chai', description: 'Spiced Indian tea brewed with ginger and cardamom', price: 20, isAvailable: true, image: '/images/masala_chai.png' },
        ];

        for (const item of menuItems) {
            await MenuItem.create({ ...item, outletId: outlet._id });
        }

        console.log('🍛 Created 5 menu items');
        console.log('\n--- SEED CREDENTIALS ---');
        console.log('Admin   → admin@campusbite.com  / password123');
        console.log('Outlet  → owner@campusbite.com  / password123');
        console.log('Student → priya@lpu.edu          / password123');
        console.log('Student → ayush@lpu.edu          / password123');
        console.log('------------------------\n');

        await mongoose.disconnect();
        console.log('✅ Seed complete. Database disconnected.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
};

seed();
