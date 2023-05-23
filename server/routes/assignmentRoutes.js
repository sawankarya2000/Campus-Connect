const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authController = require('../controllers/authController');

router.post(
  '/',
  authController.protect,
  authController.restrictTo('faculty'),
  assignmentController.uploadAssignment,
  assignmentController.createAssignment
);

router.get(
  '/get-student-with-incomplete-assignment/:id',
  authController.protect,
  authController.restrictTo('faculty'),
  assignmentController.checkFacultyValid,
  assignmentController.getUsersWithoutSubmission
);

router.get('/:id', authController.protect, assignmentController.getAssignment);

router.post(
  '/:id',
  authController.protect,
  authController.restrictTo('student'),
  assignmentController.uploadAssignment,
  assignmentController.submitAssignment
);

module.exports = router;
