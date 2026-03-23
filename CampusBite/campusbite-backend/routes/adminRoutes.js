const express = require('express');
const router = express.Router();
const { getAdminAnalytics, createOutletAccount } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/analytics')
    .get(protect, authorize('admin'), getAdminAnalytics);

router.route('/create-outlet')
    .post(protect, authorize('admin'), createOutletAccount);

module.exports = router;
