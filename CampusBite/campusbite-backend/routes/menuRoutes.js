const express = require('express');
const router = express.Router();
const { getMenuItemsByOutlet, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/outlet/:outletId')
    .get(getMenuItemsByOutlet);

router.route('/')
    .post(protect, authorize('outlet', 'admin'), createMenuItem);

router.route('/:id')
    .put(protect, authorize('outlet', 'admin'), updateMenuItem)
    .delete(protect, authorize('outlet', 'admin'), deleteMenuItem);

module.exports = router;
