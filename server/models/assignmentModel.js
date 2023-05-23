const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter the assignment title'],
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the faculty information'],
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide the assignment deadline'],
  },
  file: {
    type: String, // Store the file path or URL
  },

  course: {
    type: String,
    enum: [
      'B.Tech',
      'M.Tech',
      'B.Sc',
      'M.Sc',
      'BA',
      'MA',
      'BBA',
      'MBA',
      'BCA',
      'MCA',
    ],
    required: [true, 'Please provide the course for the assignment'],
  },
  batch: {
    type: Number,
    required: [true, 'Please provide the batch'],
    validate: {
      validator: function (value) {
        const currentYear = new Date().getFullYear();
        return value >= 2018 && value <= currentYear;
      },
      message: 'Invalid batch',
    },
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssignmentSubmission',
    },
  ],
  // Add any other fields relevant to your assignment schema
});

assignmentSchema.pre('save', function (next) {
  if (this.isModified('deadline')) {
    // Check if the deadline has passed
    const currentDateTime = new Date();
    if (this.deadline < currentDateTime) {
      this.isOpen = false;
    }
  }
  next();
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
