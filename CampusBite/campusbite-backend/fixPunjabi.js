require('dotenv').config();
const mongoose = require('mongoose');
const Outlet = require('./models/Outlet');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const outlet = await Outlet.findOneAndUpdate(
            { name: 'Punjabi Tadka' },
            { image: 'http://localhost:8000/public/images/punjabi_tadka.jpg' },
            { new: true }
        );
        console.log('✅ Updated Punjabi Tadka image to .jpg');
        console.log(outlet.image);
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
})();
