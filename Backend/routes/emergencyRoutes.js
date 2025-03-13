const express = require('express');
const { createEmergencyRequest, getEmergencyRequests } = require('../controllers/emergencyController');
const { sendBloodRequest } = require('../utils/emailService');

const router = express.Router();

router.post('/', createEmergencyRequest);
router.get('/', getEmergencyRequests);

// Add this test route
router.post('/test-email', async (req, res) => {
  try {
    const result = await sendBloodRequest(
      'recipient@example.com', // Replace with test email
      {
        patientName: 'Test Patient',
        bloodGroup: 'A+',
        unitsRequired: 2,
        replyTo: process.env.EMAIL_USER
      }
    );
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add test route
router.get('/verify-email', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.verify();
    res.json({ success: true, message: 'Email configuration is valid' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      config: {
        email: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS ? 'Set' : 'Not Set'
      }
    });
  }
});

module.exports = router;
