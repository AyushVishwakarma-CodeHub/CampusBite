const express = require('express');
const router = express.Router();
const { createOutlet, getOutlets, getOutletById, updateOutlet, getPendingOutlets, approveOutlet } = require('../controllers/outletController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all approved outlets (public) | Create outlet (outlet owner)
router.route('/')
    .get(getOutlets)
    .post(protect, authorize('outlet'), createOutlet);

// Admin: Get pending (unapproved) outlets — MUST come before /:id
router.route('/admin/pending')
    .get(protect, authorize('admin'), getPendingOutlets);

// Get single outlet | Update outlet
router.route('/:id')
    .get(getOutletById)
    .put(protect, authorize('outlet', 'admin'), updateOutlet);

// Admin: Approve or suspend an outlet
router.route('/:id/approve')
    .put(protect, authorize('admin'), approveOutlet);

module.exports = router;
