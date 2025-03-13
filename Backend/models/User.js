const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  lastDonation: Date,
  donationHistory: [{
    date: Date,
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    units: Number
  }],
  healthInfo: {
    weight: Number,
    medicalConditions: [String],
    medications: [String]
  },
  eligibleToDonate: {
    type: Boolean,
    default: true
  },
  notifications: [{
    message: String,
    type: String,
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  preferences: {
    donationReminders: { type: Boolean, default: true },
    emergencyAlerts: { type: Boolean, default: true },
    radius: { type: Number, default: 10 } // in kilometers
  }
});

// Add method to check donation eligibility
userSchema.methods.checkDonationEligibility = function() {
  if (!this.lastDonation) return true;
  
  const lastDonationDate = new Date(this.lastDonation);
  const today = new Date();
  const diffMonths = (today.getFullYear() - lastDonationDate.getFullYear()) * 12 + 
                    (today.getMonth() - lastDonationDate.getMonth());
  
  return diffMonths >= 3; // Eligible to donate after 3 months
};

module.exports = mongoose.model('User', userSchema);
