const express = require('express');
const router = express.Router();
const { getOutletAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/outlet/:outletId', protect, authorize('outlet', 'admin'), getOutletAnalytics);

module.exports = router;
