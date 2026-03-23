const PartnerRequest = require('../models/PartnerRequest');

// @desc    Submit a new partnership inquiry
// @route   POST /api/partner-requests
// @access  Public
const createPartnerRequest = async (req, res) => {
    try {
        const { name, email, phone, outletName, location } = req.body;

        const request = await PartnerRequest.create({
            name,
            email,
            phone,
            outletName,
            location
        });

        res.status(201).json({ message: 'Request submitted successfully. Our admin team will contact you soon.', request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all partnership inquiries
// @route   GET /api/partner-requests
// @access  Private (Admin only)
const getPartnerRequests = async (req, res) => {
    try {
        const requests = await PartnerRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update status of a partnership inquiry (e.g., mark as Reviewed)
// @route   PUT /api/partner-requests/:id/status
// @access  Private (Admin only)
const updatePartnerRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await PartnerRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        const updatedRequest = await request.save();

        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPartnerRequest,
    getPartnerRequests,
    updatePartnerRequestStatus
};
