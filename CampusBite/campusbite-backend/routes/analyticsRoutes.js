const express = require('express');
const router = express.Router();
const { getOutletAnalytics, getOutletPredictions } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/outlet/:outletId', protect, authorize('outlet', 'admin'), getOutletAnalytics);
router.get('/predictions/outlet/:outletId', protect, authorize('outlet', 'admin'), getOutletPredictions);


module.exports = router;
