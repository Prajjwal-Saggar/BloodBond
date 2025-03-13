const express = require('express');
const { registerUser, registerHospital, loginUser, loginHospital } = require('../controllers/authController.js');

const router = express.Router();

router.post('/register/user', registerUser);
router.post('/register/hospital', registerHospital);
router.post('/login/user', loginUser); // Ensure this endpoint is correct
router.post('/login/hospital', loginHospital);

module.exports = router;
