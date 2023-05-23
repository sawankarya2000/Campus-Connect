const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const assignmentController = require('../controllers/assignmentController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword', () => {});

router.get('/me', authController.protect, userController.getUser);
router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.get(
  '/pending-assignment',
  authController.protect,
  assignmentController.getPendingAssignmentForUser
);
router.get('/:id', userController.getUser);

router.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = router;
