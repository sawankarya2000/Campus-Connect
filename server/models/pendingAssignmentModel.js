const mongoose = require('mongoose');

const pendingAssignmentSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // ...other fields as needed
});

module.exports = mongoose.model('PendingAssignment', pendingAssignmentSchema);
