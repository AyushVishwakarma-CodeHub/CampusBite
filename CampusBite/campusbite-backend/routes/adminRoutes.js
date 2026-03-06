const express = require('express');
const router = express.Router();
const { getAdminAnalytics } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/analytics')
    .get(protect, authorize('admin'), getAdminAnalytics);

module.exports = router;
