const express = require('express');
const router = express.Router();
const { 
    createPartnerRequest, 
    getPartnerRequests, 
    updatePartnerRequestStatus 
} = require('../controllers/partnerRequestController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route for form submission
router.route('/')
    .post(createPartnerRequest)
    // Admin route to fetch the inbox
    .get(protect, authorize('admin'), getPartnerRequests);

// Admin route to clear the inbox
router.route('/:id/status')
    .put(protect, authorize('admin'), updatePartnerRequestStatus);

module.exports = router;
