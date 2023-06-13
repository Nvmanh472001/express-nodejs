const express = require("express");
const router = express.Router();

const userAccountController = require("../controllers/account/account.controller");
const configController = require("../controllers/config/config.controller");
const jobTrafficController = require("../controllers/jobtraffic/jobtraffic.controller");
const coinController = require("../controllers/coin/coin.controller");
const adminCtroller = require("../controllers/admin/admin.controller");
const moneyController = require("../controllers/money/money.controller");
const validateUser = require("../requests/validate.user");
const isAuth = require("../utils/validatetoken.util");

//Admin Apis

router.post("/login", validateUser.login(), userAccountController.login);

router.put(
  "/forgot-password",
  validateUser.forgotPassword(),
  userAccountController.forgotPassword
);

router.put(
  "/update-password",
  validateUser.updatePassword(),
  userAccountController.updatePasswordByOTP
);

module.exports = router;
