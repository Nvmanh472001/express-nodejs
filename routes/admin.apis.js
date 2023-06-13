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

router.post(
  "/create-bankinfo",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  adminCtroller.createBankInfo
);

router.get(
  "/show-bankinfo",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  adminCtroller.showBankInfo
);

router.get(
  "/show-jobtraffic",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  adminCtroller.showJobTraffic
);

router.post(
  "/find-jobtraffic",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  adminCtroller.findJobByOption
);

router.get(
  "/show-donejobtraffic",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  adminCtroller.showDoneJobUser
);

router.get(
  "/show-TxHistoryUser",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  adminCtroller.showTxHistoryUser
);

router.get(
  "/show-CoinHistoryUser",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  adminCtroller.showCoinHistoryUser
);

module.exports = router;
