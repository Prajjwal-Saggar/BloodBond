const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Hospital = require('../models/Hospital.js');

const registerUser = async (req, res) => {
  const { name, email, phone, password, bloodGroup, location, organDonation } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const user = new User({ 
      name,
      email, 
      phone, 
      password: bcrypt.hashSync(password, 10), 
      bloodGroup, 
      location, 
      organDonation 
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const registerHospital = async (req, res) => {
  const { email, phone, password, hospitalName, registrationNumber, location } = req.body;
  try {
    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hospital = new Hospital({ email, phone, password: bcrypt.hashSync(password, 10), hospitalName, registrationNumber, location });
    await hospital.save();
    res.status(201).json({ message: 'Hospital registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ 
      id: user._id, 
      type: 'user',
      name: user.name  // Add name to JWT token
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userType: 'user', userName: user.name });  // Send userName in response
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginHospital = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: hospital._id, type: 'hospital' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userType: 'hospital' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, registerHospital, loginUser, loginHospital };
