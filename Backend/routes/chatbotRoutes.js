const express = require('express');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');
const router = express.Router();

router.get('/data', async (req, res) => {
  try {
    const [hospitals, users, emergencies] = await Promise.all([
      Hospital.find().select('-password'),
      User.find().select('-password'),
      EmergencyRequest.find().sort('-createdAt').limit(10)
    ]);

    // Calculate more detailed statistics
    const statistics = {
      totalHospitals: hospitals.length,
      totalUsers: users.length,
      activeEmergencies: emergencies.filter(e => e.status === 'PENDING').length,
      bloodInventory: hospitals.reduce((acc, hospital) => {
        // Ensure all blood types are initialized
        if (!acc.aPositive) acc.aPositive = 0;
        if (!acc.aNegative) acc.aNegative = 0;
        if (!acc.bPositive) acc.bPositive = 0;
        if (!acc.bNegative) acc.bNegative = 0;
        if (!acc.abPositive) acc.abPositive = 0;
        if (!acc.abNegative) acc.abNegative = 0;
        if (!acc.oPositive) acc.oPositive = 0;
        if (!acc.oNegative) acc.oNegative = 0;

        // Sum up inventory from each hospital
        if (hospital.inventory) {
          acc.aPositive += hospital.inventory.aPositive || 0;
          acc.aNegative += hospital.inventory.aNegative || 0;
          acc.bPositive += hospital.inventory.bPositive || 0;
          acc.bNegative += hospital.inventory.bNegative || 0;
          acc.abPositive += hospital.inventory.abPositive || 0;
          acc.abNegative += hospital.inventory.abNegative || 0;
          acc.oPositive += hospital.inventory.oPositive || 0;
          acc.oNegative += hospital.inventory.oNegative || 0;
        }
        return acc;
      }, {}),
      cityWiseDistribution: hospitals.reduce((acc, h) => {
        acc[h.location.city] = (acc[h.location.city] || 0) + 1;
        return acc;
      }, {}),
      recentDonations: 0, // You can add more fields based on your data model
      averageRating: calculateAverageRating(hospitals),
      emergencyResponseTime: "30 minutes",
      bloodTypeDistribution: calculateBloodTypeDistribution(users)
    };

    res.json({
      hospitals: hospitals.map(h => ({
        name: h.hospitalName,
        location: h.location,
        inventory: h.inventory,
        reviews: h.reviews,
        rating: calculateHospitalRating(h)
      })),
      users: users.map(u => ({
        bloodGroup: u.bloodGroup,
        location: u.location
      })),
      emergencies: emergencies.map(e => ({
        bloodGroup: e.bloodGroup,
        status: e.status,
        location: e.location,
        createdAt: e.createdAt
      })),
      statistics
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chatbot data' });
  }
});

function calculateAverageRating(hospitals) {
  const ratings = hospitals.flatMap(h => h.reviews.map(r => r.rating));
  return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;
}

function calculateHospitalRating(hospital) {
  const ratings = hospital.reviews.map(r => r.rating);
  return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;
}

function calculateBloodTypeDistribution(users) {
  return users.reduce((acc, user) => {
    acc[user.bloodGroup] = (acc[user.bloodGroup] || 0) + 1;
    return acc;
  }, {});
}

module.exports = router;
