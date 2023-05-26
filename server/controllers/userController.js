const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');

// Get user details
exports.getUser = async (req, res, next) => {
  try {
    let user;

    if (req.query.name) {
      user = await User.find();
    } else if (req.params.id) {
      user = await User.findById(req.params.id);
    } else {
      user = req.user;
    }

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Create new user
exports.createUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      password,
      passwordConfirm,
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
      passwordConfirm,
      role,
      collegeId,
      course,
      department,
      joiningYear,
    });
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    // Delete user document from the database
    const user = await User.findById(req.user.id).select('+password');

    if (await user.correctPassword(req.body.password, user.password)) {
      await user.deleteOne();
    } else {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect Password',
      });
    }

    ///Delete JWT cookies
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    // Send response with success message
    res.status(204).json({
      status: 'success',
      message: 'User deleted successfully',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

//Multer storage engine to store uploaded files
const multerStorage = multer.memoryStorage();

//Multer filter to only accept image files
const multerFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    return cb(new Error('Not an image! Please upload only images.'), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = (req, res, next) => {
  upload.single('photo')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        status: 'fail',
        message: err.message,
      });
    } else if (err) {
      // Unknown error occured when uploading
      return res.status(400).json({
        status: 'fail',
        message: err.message,
      });
    }

    next();
  });
};

exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  delete req.file.buffer;
  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return res.status(400).json({
      status: 'fail',
      message: 'This route is not for password updates.',
    });
  }

  // 2) Filter Out unwanted fields from json data
  const filteredBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'passingYear',
    'collegeId'
  );
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) Update user document
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'User Details not valid',
    });
  }
};
