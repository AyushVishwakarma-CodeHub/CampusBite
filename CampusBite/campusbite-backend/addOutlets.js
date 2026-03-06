/**
 * Add extra outlets — run once with: node addOutlets.js
 * Does NOT wipe existing data.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Outlet = require('./models/Outlet');
const MenuItem = require('./models/MenuItem');

const OUTLETS = [
    {
        name: 'Campus Cafe',
        description: 'Cozy cafe with freshly brewed coffee, sandwiches, and light snacks.',
        location: 'Block 10, Ground Floor',
        openingTime: '07:30', closingTime: '20:00',
        menu: [
            { name: 'Cappuccino', price: 55, description: 'Rich espresso topped with velvety steamed milk foam.' },
            { name: 'Club Sandwich', price: 90, description: 'Triple-layered toasted sandwich with chicken & veggies.' },
            { name: 'Cold Coffee', price: 65, description: 'Chilled coffee blended with ice cream and milk.' },
            { name: 'Veg Wrap', price: 70, description: 'Whole wheat tortilla stuffed with grilled veggies & cheese.' },
            { name: 'Brownie Fudge', price: 50, description: 'Warm chocolate brownie with a molten fudge centre.' },
        ],
    },
    {
        name: 'Kitchen Ette',
        description: 'Homestyle North Indian comfort food with daily specials.',
        location: 'Block 21, Level 1',
        openingTime: '09:00', closingTime: '18:00',
        menu: [
            { name: 'Dal Makhani', price: 90, description: 'Slow-cooked black lentils in rich buttery tomato gravy.' },
            { name: 'Jeera Rice', price: 60, description: 'Basmati rice tempered with cumin and fresh coriander.' },
            { name: 'Kadhai Paneer', price: 130, description: 'Cottage cheese tossed with bell peppers in a spiced masala.' },
            { name: 'Butter Naan', price: 30, description: 'Soft leavened flatbread brushed with butter.' },
            { name: 'Gulab Jamun', price: 35, description: 'Milk-solid dumplings soaked in rose-flavoured sugar syrup.' },
        ],
    },
    {
        name: 'Oven Express',
        description: 'Freshly baked pizzas, garlic breads, and pasta — ready in 10 minutes.',
        location: 'Block 5, Food Court',
        openingTime: '11:00', closingTime: '21:00',
        menu: [
            { name: 'Margherita Pizza', price: 150, description: 'Classic tomato sauce with fresh mozzarella and basil.' },
            { name: 'Pepperoni Pizza', price: 190, description: 'Loaded with spicy pepperoni and mozzarella on a crispy base.' },
            { name: 'Penne Arrabbiata', price: 120, description: 'Penne pasta in a spicy tomato and garlic sauce.' },
            { name: 'Garlic Bread', price: 60, description: 'Toasted baguette slices with herb butter and garlic.' },
            { name: 'Choco Lava Cake', price: 70, description: 'Warm chocolate cake with a gooey molten lava centre.' },
        ],
    },
    {
        name: 'Campus Fusion',
        description: 'East-meets-West fusion kitchen blending Asian and Western flavours.',
        location: 'Block 16, Level 2',
        openingTime: '10:00', closingTime: '20:00',
        menu: [
            { name: 'Schezwan Pasta', price: 110, description: 'Penne tossed in a fiery Schezwan stir-fry sauce.' },
            { name: 'Korean Fried Rice', price: 130, description: 'Gochujang-spiced fried rice with vegetables and egg.' },
            { name: 'Paneer Tacos', price: 100, description: 'Crispy tacos filled with tandoori paneer and slaw.' },
            { name: 'Honey Chilli Potato', price: 85, description: 'Crisp potato fingers glazed in sweet chilli honey sauce.' },
            { name: 'Mango Smoothie', price: 60, description: 'Thick Alphonso mango blended with chilled yogurt.' },
        ],
    },
    {
        name: 'Bengali Bawarchi',
        description: 'Authentic Bengali cuisine — hilsa fish, mishti doi, and more.',
        location: 'Block 38, Canteen Wing',
        openingTime: '11:00', closingTime: '19:30',
        menu: [
            { name: 'Machher Jhol', price: 150, description: 'Traditional light mustard fish curry with potatoes.' },
            { name: 'Moong Dal', price: 60, description: 'Slow-cooked split green-gram dal with a tadka finish.' },
            { name: 'Aloo Posto', price: 80, description: 'Potatoes cooked with poppy seed paste in mustard oil.' },
            { name: 'Mishti Doi', price: 45, description: 'Bengali sweetened yogurt with a caramelised finish.' },
            { name: 'Roshogolla', price: 40, description: 'Spongy cottage cheese balls soaked in light sugar syrup.' },
        ],
    },
    {
        name: 'Yummy Meals',
        description: 'Budget-friendly all-day thalis and combos for hungry students.',
        location: 'Block 1, Main Canteen',
        openingTime: '08:00', closingTime: '21:00',
        menu: [
            { name: 'Full Thali', price: 120, description: '2 sabzis, dal, rice, roti, salad, and a sweet — all in one.' },
            { name: 'Mini Thali', price: 80, description: 'Dal, rice, roti, and one sabzi — perfect for a quick lunch.' },
            { name: 'Veg Biryani', price: 100, description: 'Fragrant basmati rice layered with spiced mixed vegetables.' },
            { name: 'Dum Aloo', price: 85, description: 'Baby potatoes slow-cooked in a rich Kashmiri gravy.' },
            { name: 'Raita', price: 30, description: 'Creamy beaten yogurt with cucumber, cumin, and mint.' },
        ],
    },
];

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Use the admin user as the owner for all these outlets
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) throw new Error('No admin user found. Run seed.js first.');

        for (const data of OUTLETS) {
            // Skip if outlet with this name already exists
            const exists = await Outlet.findOne({ name: data.name });
            if (exists) {
                console.log(`⏩ Skipping (already exists): ${data.name}`);
                continue;
            }

            const outlet = await Outlet.create({
                name: data.name,
                description: data.description,
                location: data.location,
                openingTime: data.openingTime,
                closingTime: data.closingTime,
                ownerId: admin._id,
                isApproved: true,
            });

            for (const item of data.menu) {
                await MenuItem.create({ ...item, outletId: outlet._id, isAvailable: true });
            }

            console.log(`✅ Added: ${data.name} with ${data.menu.length} menu items`);
        }

        console.log('\n🎉 All outlets added successfully!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();
