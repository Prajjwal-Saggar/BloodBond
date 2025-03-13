const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  hospitalName: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  inventory: {
    aPositive: { type: Number, default: 0, min: 0 },
    aNegative: { type: Number, default: 0, min: 0 },
    bPositive: { type: Number, default: 0, min: 0 },
    bNegative: { type: Number, default: 0, min: 0 },
    abPositive: { type: Number, default: 0, min: 0 },
    abNegative: { type: Number, default: 0, min: 0 },
    oPositive: { type: Number, default: 0, min: 0 },
    oNegative: { type: Number, default: 0, min: 0 }
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
    default: 'ACTIVE'
  },
  operatingHours: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '18:00' }
  },
  emergencyContact: {
    name: String,
    phone: String
  },
  reviews: [{
    userName: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }]
});

// Add method to check blood availability
hospitalSchema.methods.checkBloodAvailability = function(bloodGroup, units) {
  const inventory = this.inventory;
  const bloodTypeMap = {
    'A+': 'aPositive',
    'A-': 'aNegative',
    'B+': 'bPositive',
    'B-': 'bNegative',
    'AB+': 'abPositive',
    'AB-': 'abNegative',
    'O+': 'oPositive',
    'O-': 'oNegative'
  };
  
  const inventoryKey = bloodTypeMap[bloodGroup];
  return inventory[inventoryKey] >= units;
};

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
