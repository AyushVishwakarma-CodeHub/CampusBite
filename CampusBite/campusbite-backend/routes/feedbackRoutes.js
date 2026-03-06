const express = require('express');
const router = express.Router();
const { submitFeedback, getOutletFeedback, checkOrderFeedback } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('student'), submitFeedback);

router.route('/outlet/:outletId')
    .get(protect, getOutletFeedback);

router.route('/order/:orderId')
    .get(protect, checkOrderFeedback);

module.exports = router;
