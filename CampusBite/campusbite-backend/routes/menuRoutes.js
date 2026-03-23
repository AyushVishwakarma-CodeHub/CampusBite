const express = require('express');
const router = express.Router();
const { getMenuItemsByOutlet, createMenuItem, updateMenuItem, deleteMenuItem, upload, uploadImage, generateAiImage } = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route for manually uploading food photography directly to the server filesystem
router.post('/upload', protect, authorize('outlet'), upload.single('image'), uploadImage);

// Route for proxying AI generation inside the protected cluster
router.post('/generate', protect, authorize('outlet'), generateAiImage);

router.route('/outlet/:outletId')
    .get(getMenuItemsByOutlet);

router.route('/')
    .post(protect, authorize('outlet', 'admin'), createMenuItem);

router.route('/:id')
    .put(protect, authorize('outlet', 'admin'), updateMenuItem)
    .delete(protect, authorize('outlet', 'admin'), deleteMenuItem);

module.exports = router;
