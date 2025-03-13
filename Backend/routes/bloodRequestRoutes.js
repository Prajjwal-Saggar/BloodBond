const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const BloodRequest = require('../models/BloodRequest');
const Hospital = require('../models/Hospital');
const { sendBloodRequest } = require('../utils/emailService');

// Create a blood request
router.post('/:hospitalId', auth, async (req, res) => {
  try {
    const { patientName, bloodGroup, unitsRequired, priority } = req.body;
    const hospitalId = req.params.hospitalId;

    // Validate hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Check blood availability
    if (!hospital.checkBloodAvailability(bloodGroup, unitsRequired)) {
      return res.status(400).json({ message: 'Required blood units not available' });
    }

    // Create blood request
    const bloodRequest = new BloodRequest({
      patientName,
      bloodGroup,
      unitsRequired,
      priority: priority || 'NORMAL',
      hospital: hospitalId,
      user: req.user.id,
      status: 'PENDING'
    });

    await bloodRequest.save();

    // Send email to hospital
    try {
      await sendBloodRequest(hospital.email, {
        patientName,
        bloodGroup,
        unitsRequired,
        replyTo: req.user.email
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      requestId: bloodRequest._id
    });

  } catch (error) {
    console.error('Blood request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's blood requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await BloodRequest.find({ user: req.user.id })
      .populate('hospital', 'hospitalName email phone')
      .sort({ requestDate: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel blood request
router.put('/cancel/:requestId', auth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Cannot cancel processed request' });
    }

    request.updateStatus('CANCELLED', 'Cancelled by user');
    await request.save();

    res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
