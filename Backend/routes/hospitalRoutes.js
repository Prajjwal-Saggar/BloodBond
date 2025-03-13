const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getHospitalProfile,
  updateInventory,
  getAllHospitals,
  getHospitalById,
  addReview,
  requestBlood,
  getHospitalRequests,
  updateRequestStatus
} = require('../controllers/hospitalController');

// Protected routes should come before parameterized routes to avoid conflicts
router.get('/profile', auth, getHospitalProfile);
router.get('/requests', auth, getHospitalRequests);
router.put('/inventory', auth, updateInventory);
router.put('/requests/:requestId', auth, updateRequestStatus);

// Public and parameterized routes
router.get('/', getAllHospitals);
router.get('/:id', getHospitalById);
router.post('/:id/reviews', auth, addReview);
router.post('/:hospitalId/request-blood', auth, requestBlood);

module.exports = router;
