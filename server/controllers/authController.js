const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const dotenv = require('dotenv');
const Email = require('../utils/email');

dotenv.config({ path: `${__dirname}/../config/config.env` });

// Create a JWT token
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// Signup user
exports.signup = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      password,
      role,
      collegeId,
      course,
      department,
      joiningYear,
    } = req.body;

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      dateOfBirth,
      password,
      role,
      collegeId,
      course,
      department,
      joiningYear,
    });

    console.log(newUser);

    // await new Email(newUser).sendWelcome();

    createSendToken(newUser, 201, req, res);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select(
      '+password -createdAt -joiningYear -posts'
    );

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    // Send JWT token and user data in response
    createSendToken(user, 200, req, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

// Protect routes from unauthorized users
exports.protect = async (req, res, next) => {
  // Get Token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'No Login Token Found',
    });
  }

  //Verification Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: 'fail',
      message: 'User no longer exists',
    });
  }
  req.user = currentUser;
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to perform this action',
      });
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  // 1) Get user based on Posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'There is no user with email address.',
    });
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user).sendPasswordReset(resetURL);

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      status: 'fail',
      message: 'There was an error sending email.Try again later!',
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return res.status(400).json({
      status: 'success',
      message: 'Token is invalid or has expired',
    });
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changedPasswordAt property for the user

  // 4) Send Response as success
  res.status(200).json({
    status: 'success',
  });
};
