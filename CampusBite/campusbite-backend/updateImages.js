/**
 * Update outlet images — run with: node updateImages.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Outlet = require('./models/Outlet');

const IMAGE_MAP = {
    'Campus Cafe': 'http://localhost:8000/public/images/campus_cafe.png',
    'Kitchen Ette': 'http://localhost:8000/public/images/kitchen_ette.png',
    'Oven Express': 'http://localhost:8000/public/images/oven_express.png',
    'Campus Fusion': 'http://localhost:8000/public/images/campus_fusion.png',
    'Bengali Bawarchi': 'http://localhost:8000/public/images/bengali_bawarchi.png',
    'Yummy Meals': 'http://localhost:8000/public/images/yummy_meals.png',
    'Punjabi Tadka': 'http://localhost:8000/public/images/punjabi_tadka.png'
};

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');

        for (const [name, path] of Object.entries(IMAGE_MAP)) {
            const outlet = await Outlet.findOneAndUpdate({ name }, { image: path }, { new: true });
            if (outlet) {
                console.log(`✅ Updated image for: ${name}`);
            } else {
                console.log(`⏩ Outlet not found: ${name}`);
            }
        }

        console.log('\n🎉 Image update complete!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error details:');
        console.dir(err);
        process.exit(1);
    }
})();
