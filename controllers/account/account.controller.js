const accountRepository = require("../../repositories/account.repository");
const { validationResult } = require("express-validator");
const { _errorFormatter } = require("../../utils/helper.util");
const logger = require("../../utils/logger.util");
const auth = require("../../utils/validatetoken.util");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const moment = require("moment");

const {
  handlerSuccess,
  handlerBadRequestError,
  handlerNotFoundError,
  handlerPermissionDeniedError,
} = require("../../utils/handler.response.util");

const SALT_WORK_FACTOR = 10;

module.exports = {
  classname: "AccountController",

  register: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = _errorFormatter(errors.array());
      return handlerBadRequestError(req, res, errorMsg);
    }

    try {
      const newAccount = {
        username: req.body.username,
        password: req.body.password,
        coinAmount: 0,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        role: "USER",
        isDeleted: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const findParams = {
        $or: [
          { username: req.body.username },
          { phoneNumber: req.body.phoneNumber },
        ],
      };

      const user = await accountRepository.findByPhoneOrUsername(findParams);
      if (user) {
        return handlerBadRequestError(
          req,
          res,
          "Tên tài khoản hoặc số điện thoại đăng ký đã tồn tại!"
        );
      }

      const createAccount = await accountRepository.create(newAccount);
      return handlerSuccess(req, res, createAccount);
    } catch (error) {
      logger.error(new Error(error));
      next(error);
    }
  },

  login: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = _errorFormatter(errors.array());
      return handlerBadRequestError(req, res, errorMsg);
    }

    try {
      const account = {
        username: req.body.username,
        password: req.body.password,
      };

      let comparePassword;
      const findParams = {
        $or: [{ username: account.username }, { password: account.password }],
      };

      const user = await accountRepository.findByUsernameOrPassword(findParams);
      if (!user) {
        return handlerBadRequestError(
          req,
          res,
          "Tài khoản hoặc mật khẩu bị sai!"
        );
      }

      if (user.isDeleted === true) {
        return handlerBadRequestError(req, res, "Tài khoản đã bị xóa!");
      }

      await user.comparePassword(account.password).then((data) => {
        comparePassword = data;
      });

      if (!comparePassword) {
        return handlerBadRequestError(
          req,
          res,
          "Tài khoản hoặc mật khẩu bị sai!"
        );
      }

      const accountInfo = {
        id: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        role: user.role,
      };

      const accessToken = auth.generateAccessToken(accountInfo);
      const refreshToken = auth.generateRefreshToken({ id: user._id });

      //update user
      await accountRepository.update(user._id, {
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      return handlerSuccess(req, res, {
        info: accountInfo,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      logger.error(new Error(error));
      next(error);
    }
  },

  async forgotPassword(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = _errorFormatter(errors.array());
      return handlerBadRequestError(req, res, errorMsg);
    }
    try {
      const user = await accountRepository.findByEmail(req.body.email);
      if (!user) {
        return handlerNotFoundError(req, res, "Không tìm thấy tài khoản này");
      }

      const otpCode = Math.floor(1000 + Math.random() * 900000);

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "autobankingamai@gmail.com",
          pass: "njxcxkajpcizwyel",
        },
      });

      var mailOptions = {
        from: "autobankingamai@gmail.com",
        to: user.email,
        subject: "Sending OTP for reset password",
        text: `OTP: ${otpCode}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      await accountRepository.update(user._id, {
        otp: otpCode,
        otpExpiredAt: moment().add(10, "minutes").toDate(),
      });

      return handlerSuccess(req, res, "SEND EMAIL SUCCESSFULLY !!");
    } catch (error) {
      logger.error(new Error(error));
      next(error);
    }
  },

  async changePasswords(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = _errorFormatter(errors.array());
      return handlerBadRequestError(req, res, errorMsg);
    }
    try {
    } catch (error) {
      logger.error(new Error(error));
      next(error);
    }
  },

  async updatePasswordByOTP(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = _errorFormatter(errors.array());
      return handlerBadRequestError(req, res, errorMsg);
    }
    try {
      const account = await accountRepository.findByEmailAndOTP(
        req.body.email,
        req.body.otp
      );
      if (!account) {
        return handlerNotFoundError(req, res, "Không tìm thấy tài khoản này");
      }

      if (moment(account.otpExpiredAt) < moment()) {
        return handlerBadRequestError(req, res, "OTP đã hết hạn");
      }
      const newPassword = req.body.newPassword;
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      const update = await accountRepository.update(account._id, {
        password: newPasswordHash,
      });
      if (!update) {
        return handlerNotFoundError(req, res, "Không tìm thấy tài khoản này");
      }
      return handlerSuccess(req, res, update);
    } catch (error) {
      logger.error(new Error(error));
      next(error);
    }
  },
};
