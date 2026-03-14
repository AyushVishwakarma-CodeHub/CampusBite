require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const updates = [
            { name: 'Aloo Paratha', image: '/images/aloo_paratha.png' },
            { name: 'Chole Bhature', image: '/images/chole_bhature.png' },
            { name: 'Paneer Butter Masala', image: '/images/paneer_butter_masala.png' },
            { name: 'Sweet Lassi', image: '/images/sweet_lassi.png' },
            { name: 'Masala Chai', image: '/images/masala_chai.png' }
        ];

        for (const up of updates) {
            const result = await MenuItem.updateMany(
                { name: up.name },
                { $set: { image: up.image } }
            );
            console.log(`Updated ${up.name}: ${result.modifiedCount} docs`);
        }

        await mongoose.disconnect();
        console.log('✅ Update complete.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Update failed:', err.message);
        process.exit(1);
    }
};

updateImages();
