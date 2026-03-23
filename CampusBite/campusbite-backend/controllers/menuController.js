const MenuItem = require('../models/MenuItem');
const Outlet = require('../models/Outlet');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Upload image handler
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Return the full URL of the uploaded image
        const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/public/images/${req.file.filename}`;
        
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
};

const axios = require('axios');
const fs = require('fs');

// Generate AI Image and proxy write it to disk to bypass CORS / Hotlink protections
const generateAiImage = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ message: "Prompt is required." });

        const aiUrl = `https://api.airforce/v1/imagine?prompt=${encodeURIComponent(prompt)}`;
        
        // Fetch raw image buffer natively from Node (bypassing Client browser CORS blocks entirely)
        const response = await axios({
            url: aiUrl,
            method: 'GET',
            responseType: 'arraybuffer'
        });

        // Use the same robust storage pattern as Multer disk storage
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `ai-gen-${uniqueSuffix}.jpg`;
        const filepath = path.join(__dirname, '../public/images', filename);

        // Dump binary stream into public/images physically
        fs.writeFileSync(filepath, response.data);

        // Send back standard local API map URL
        const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
        res.status(200).json({ imageUrl: `${baseUrl}/public/images/${filename}` });

    } catch (error) {
        console.error("AI Proxy Generation Error:", error.message);
        res.status(500).json({ message: "Failed to generate physical image from AI" });
    }
};

const getMenuItemsByOutlet = async (req, res) => {
    try {
        const items = await MenuItem.find({ outletId: req.params.outletId });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createMenuItem = async (req, res) => {
    const { outletId, name, price, description, image, isAvailable } = req.body;
    try {
        // Verify outlet ownership
        const outlet = await Outlet.findById(outletId);
        if (!outlet) return res.status(404).json({ message: 'Outlet not found' });

        if (outlet.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to add menu items to this outlet' });
        }

        const menuItem = await MenuItem.create({
            outletId,
            name,
            price,
            description,
            image,
            isAvailable
        });

        res.status(201).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

        const outlet = await Outlet.findById(menuItem.outletId);
        if (outlet.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

        const outlet = await Outlet.findById(menuItem.outletId);
        if (outlet.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await menuItem.deleteOne();
        res.json({ message: 'Menu item removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getMenuItemsByOutlet, createMenuItem, updateMenuItem, deleteMenuItem, upload, uploadImage, generateAiImage };
