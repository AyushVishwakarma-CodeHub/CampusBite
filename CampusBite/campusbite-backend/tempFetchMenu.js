require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const MenuItem = require('./models/MenuItem');
const Outlet = require('./models/Outlet');

async function fetchMenus() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const items = await MenuItem.find().populate('outletId');
        let content = '';
        for (let i of items) {
           let outletName = i.outletId ? i.outletId.name : 'Unknown Outlet';
           content += `${outletName} - ${i.name} - ${i.image || 'NO IMAGE'}\n`;
        }
        fs.writeFileSync('menu_items_log.txt', content);
        console.log("Done extracting menu items.");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await mongoose.disconnect();
    }
}

fetchMenus();
