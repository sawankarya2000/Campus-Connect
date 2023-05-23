const multer = require('multer');
const path = require('path');
const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');
const AssignmentSubmission = require('../models/assignmentSubmissionModel');
const PendingAssignment = require('../models/pendingAssignmentModel');

//Multer storage engine to store uploaded files
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads/assignments`);
  },
  filename: function (req, file, cb) {
    const filename = `assignment-${req.user.id}-${Date.now()}.pdf`;

    cb(null, filename);
  },
});

//Multer filter to only accept image files
const multerFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    return cb(
      new Error('Invalid file format. Only PDF files are allowed.'),
      false
    );
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadAssignment = upload.single('file');

exports.createAssignment = async (req, res) => {
  try {
    if (req.file.filename) req.body.file = req.file.filename;

    const assignment = await Assignment.create({
      ...req.body,
      faculty: req.user._id, // Assuming faculty user is authenticated and stored in req.user
    });

    //Find all students enrolled in the course and batch
    const students = await User.find({
      role: 'student',
      joiningYear: req.body.batch,
      course: req.body.course,
    });

    console.log(students);
    //Traverse over this array
    students.forEach(async (student) => {
      const userId = student._id;

      const pendingAssignment = await PendingAssignment.create({
        assignment: assignment._id,
        student: userId,
      });
    });

    console.log(students);

    res.status(201).json({
      status: 'success',
      data: {
        assignment,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.getAssignment = async (req, res) => {
  const assignmentId = req.params.id;
  try {
    //Retrieve assignment from database
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Assignment not found.',
      });
    }

    res.sendFile(
      path.resolve(`./public/uploads/assignments/${assignment.file}`)
    );
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while retrieving the assignment.',
    });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (assignment.deadline < Date.now()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Deadline for this assignment has passed.',
      });
    }

    const submission = await AssignmentSubmission.create({
      assignment: req.params.id,
      student: req.user._id,
      file: req.file.filename,
    });

    //Update assignment as well
    assignment.submissions.push(submission._id);
    assignment.save();

    //Update pending assignment as well
    const pendingAssignment = await PendingAssignment.findOneAndDelete({
      assignment: assignment._id,
      student: req.user._id,
    });

    // Assignment submission saved successfully
    res.status(200).json({
      status: 'success',
      message: 'Assignment submitted successfully.',
      submissionId: submission._id,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while submitting the assignment.',
    });
  }
};

exports.getPendingAssignmentForUser = async (req, res) => {
  try {
    const pendingAssignments = await PendingAssignment.find({
      student: req.user._id,
    }).populate('assignment');

    res.status(200).json({
      status: 'success',
      data: {
        pendingAssignments,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while retrieving the pending assignments.',
    });
  }
};

exports.checkFacultyValid = async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id);
  if (assignment.faculty.toString() === req.user._id.toString()) {
    next();
  } else {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not authorized to perform this action.',
    });
  }
};

exports.getUsersWithoutSubmission = async (req, res) => {
  try {
    const usersWithoutSubmission = await PendingAssignment.find({
      assignment: req.params.id,
    }).populate('student');

    res.status(200).json({
      status: 'success',
      data: {
        usersWithoutSubmission,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message:
        'An error occurred while retrieving the users without submission.',
    });
  }
};
