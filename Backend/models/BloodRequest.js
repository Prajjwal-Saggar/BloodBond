const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  unitsRequired: {
    type: Number,
    required: true,
    min: 1
  },
  priority: {
    type: String,
    enum: ['NORMAL', 'URGENT', 'EMERGENCY'],
    default: 'NORMAL'
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'FULFILLED', 'CANCELLED'],
    default: 'PENDING'
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  responseDate: {
    type: Date
  },
  notes: {
    type: String
  },
  medicalDocuments: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  timeline: [{
    status: String,
    date: { type: Date, default: Date.now },
    notes: String
  }]
});

// Add method to update status with timeline
bloodRequestSchema.methods.updateStatus = function(newStatus, notes) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    notes: notes,
    date: new Date()
  });
};

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
