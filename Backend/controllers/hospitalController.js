const Hospital = require('../models/Hospital.js');
const BloodRequest = require('../models/BloodRequest.js');
const User = require('../models/User.js');
const { sendBloodRequest } = require('../utils/emailService.js');

const getHospitalProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const hospital = await Hospital.findById(req.user.id).select('-password');
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (err) {
    console.error('getHospitalProfile error:', err);
    res.status(500).json({ message: 'Error fetching hospital profile' });
  }
};

const updateInventory = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Update inventory with the new values
    hospital.inventory = {
      ...hospital.inventory,
      ...req.body
    };

    const updatedHospital = await hospital.save();
    
    // Return the updated inventory
    res.json({ 
      message: 'Inventory updated successfully',
      inventory: updatedHospital.inventory 
    });
  } catch (err) {
    console.error('Error updating inventory:', err);
    res.status(500).json({ message: 'Error updating inventory' });
  }
};

const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().select('-password');
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).select('-password');
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (err) {
    console.error('Error fetching hospital:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const hospital = await Hospital.findById(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Use the name from the JWT token
    const review = {
      userName: req.user.name,  // This comes from the JWT token now
      rating,
      comment,
      date: new Date()
    };

    hospital.reviews.unshift(review);  // Add new review at the beginning
    await hospital.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ message: 'Error adding review' });
  }
};

const requestBlood = async (req, res) => {
  try {
    const { patientName, bloodGroup, unitsRequired } = req.body;
    const hospitalId = req.params.hospitalId;
    const userId = req.user.id;

    // Input validation
    if (!patientName || !bloodGroup || !unitsRequired) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate hospital exists and has enough blood
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Check blood availability
    if (!hospital.checkBloodAvailability(bloodGroup, unitsRequired)) {
      return res.status(400).json({ message: 'Required blood units not available' });
    }

    // Get user details for email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create blood request
    const bloodRequest = new BloodRequest({
      patientName,
      bloodGroup,
      unitsRequired,
      hospital: hospitalId,
      user: userId,
      status: 'PENDING'
    });

    await bloodRequest.save();

    // Send email notification
    try {
      await sendBloodRequest(hospital.email, {
        patientName,
        bloodGroup,
        unitsRequired,
        replyTo: user.email
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Blood request sent successfully',
      requestId: bloodRequest._id
    });

  } catch (error) {
    console.error('Blood request error:', error);
    res.status(500).json({ 
      message: 'Error processing blood request',
      error: error.message 
    });
  }
};

const getHospitalRequests = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const hospital = await Hospital.findById(req.user.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const requests = await BloodRequest.find({ hospital: req.user.id })
      .populate('user', 'name email phone')
      .sort({ requestDate: -1 });

    const pendingRequests = requests.filter(req => req.status === 'PENDING');
    const approvedRequests = requests.filter(req => req.status === 'APPROVED');

    res.json({ 
      pendingRequests, 
      approvedRequests,
      total: requests.length 
    });
  } catch (err) {
    console.error('getHospitalRequests error:', err);
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, notes } = req.body;

    const request = await BloodRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.hospital.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    request.notes = notes;
    request.responseDate = new Date();
    await request.save();

    res.json({ message: 'Request updated successfully', request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { 
  getHospitalProfile, 
  updateInventory, 
  getAllHospitals,
  getHospitalById,
  addReview,
  requestBlood,
  getHospitalRequests,
  updateRequestStatus
};
