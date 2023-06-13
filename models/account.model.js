const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isNull } = require("lodash");
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },

  auto: {
    type: Boolean,
    required: true,
  },

  isActive: {
    type: Boolean,
    required: true,
  },

  coinAmount: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true,
    match: [/.+@.+\..+/, "Địa chỉ email không hợp lệ"],
  },
  role: {
    type: String,
    required: true,
    default: "USER",
  },
  otp: {
    type: Number,
    required: false,
    default: null,
  },
  otpExpiredAt: {
    type: Date,
    required: false,
    default: null,
  },
  access_token: {
    type: String,
    required: false,
    trim: true,
  },
  refresh_token: {
    type: String,
    required: false,
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    required: false,
    default: null,
  },
  updatedAt: {
    type: Date,
    required: false,
    default: null,
  },
});

UserSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password).then((data) => {
      return resolve(data);
    });
  });
};

module.exports = mongoose.model("User", UserSchema);
