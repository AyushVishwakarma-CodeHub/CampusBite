const Outlet = require('../models/Outlet');

const createOutlet = async (req, res) => {
    try {
        const { name, description, location, openingTime, closingTime, image } = req.body;

        // Check if user is already an outlet owner
        const existingOutlet = await Outlet.findOne({ ownerId: req.user.id });
        if (existingOutlet) {
            return res.status(400).json({ message: 'User already owns an outlet' });
        }

        const outlet = await Outlet.create({
            name,
            ownerId: req.user.id,
            description,
            location,
            openingTime,
            closingTime,
            image,
            isApproved: false, // Requires admin approval
        });

        res.status(201).json(outlet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPendingOutlets = async (req, res) => {
    try {
        const outlets = await Outlet.find({ isApproved: false }).populate('ownerId', 'name email');
        res.json(outlets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveOutlet = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) return res.status(404).json({ message: 'Outlet not found' });

        outlet.isApproved = req.body.approve !== false; // default true
        await outlet.save();

        res.json({ message: `Outlet ${outlet.isApproved ? 'approved' : 'suspended'} successfully`, outlet });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOutlets = async (req, res) => {
    try {
        const outlets = await Outlet.find({ isApproved: true }).populate('ownerId', 'name email');
        res.json(outlets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOutletById = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id).populate('ownerId', 'name email');
        if (outlet) {
            res.json(outlet);
        } else {
            res.status(404).json({ message: 'Outlet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOutlet = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (outlet) {
            if (outlet.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to update this outlet' });
            }
            outlet.name = req.body.name || outlet.name;
            outlet.description = req.body.description || outlet.description;
            outlet.location = req.body.location || outlet.location;
            outlet.openingTime = req.body.openingTime || outlet.openingTime;
            outlet.closingTime = req.body.closingTime || outlet.closingTime;
            outlet.image = req.body.image || outlet.image;
            const updatedOutlet = await outlet.save();
            res.json(updatedOutlet);
        } else {
            res.status(404).json({ message: 'Outlet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOutlet, getOutlets, getOutletById, updateOutlet, getPendingOutlets, approveOutlet };
