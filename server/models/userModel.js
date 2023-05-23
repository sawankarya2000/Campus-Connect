const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please enter your date of birth'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'hod', 'director', 'alumni'],
    default: 'student',
  },
  collegeId: {
    type: String,
    unique: true,
    required: [true, 'Please provide your college ID'],
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
    required: function () {
      return this.role === 'student';
    },
    message: 'Please provide your course',
  },
  department: {
    type: String,
    required: [true, 'Please provide your department'],
  },
  joiningYear: {
    type: Number,
    required: [true, 'Please provide your joining year'],
    validate: {
      validator: function (value) {
        return validator.isInt(String(value), {
          min: 2018,
          max: new Date().getFullYear(),
        });
      },
      message:
        'Joining year should be a valid year between 2018 and the current year',
    },
  },
  passingYear: {
    type: Number,
    validate: {
      validator: function (value) {
        return validator.isInt(String(value), {
          min: this.joiningYear,
          max: new Date().getFullYear(),
        });
      },
      message:
        'Passing year cannot be before joining year or after the current year',
    },

    required: function () {
      return this.role === 'student';
    },
    message: 'Please provide your passing year',
  },
  alumini: {
    type: Boolean,
    default: function () {
      return this.passingYear ? true : false;
    },
    required: function () {
      return this.role === 'student';
    },
    message: 'Please provide your passing year',
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  passwordResetToken: String,
  passwordResetExpires: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //Hash and salt password
  this.password = await bcrypt.hash(this.password, 12);

  //We dont need to save passwordConfirm. It is used only for verification
  // this.passwordConfirm = undefined;
  next();
});

//Methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  // Generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set it to user's passwordResetToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set password reset expiration to 10 minutes from now
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Return the unhashed reset token for sending in email
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
