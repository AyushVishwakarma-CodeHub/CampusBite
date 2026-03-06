require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected successfully');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Connection failed:');
        console.error(err);
    }
})();
