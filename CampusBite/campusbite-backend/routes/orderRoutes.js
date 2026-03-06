const express = require('express');
const router = express.Router();
const { createOrder, getStudentOrders, getOutletOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('student', 'admin'), createOrder);

router.route('/myorders')
    .get(protect, authorize('student', 'admin'), getStudentOrders);

router.route('/outlet/:outletId')
    .get(protect, authorize('outlet', 'admin'), getOutletOrders);

router.route('/:id/status')
    .put(protect, authorize('outlet', 'admin'), updateOrderStatus);

module.exports = router;
