require('dotenv').config();
const mongoose = require('mongoose');
const Outlet = require('./models/Outlet');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const outlet = await Outlet.findOne({ name: 'Punjabi Tadka' });
        console.log('Outlet Data for Punjabi Tadka:');
        console.dir(outlet.toObject());
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
})();
