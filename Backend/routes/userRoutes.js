const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/blood-requests', authMiddleware, async (req, res) => {
  try {
    const requests = await BloodRequest.find({ user: req.user.id })
      .populate('hospital', 'hospitalName')
      .sort({ requestDate: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
