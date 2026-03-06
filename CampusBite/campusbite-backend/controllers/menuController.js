const MenuItem = require('../models/MenuItem');
const Outlet = require('../models/Outlet');

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
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMenuItemsByOutlet, createMenuItem, updateMenuItem, deleteMenuItem };
