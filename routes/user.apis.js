const express = require("express");
const router = express.Router();

const userAccountController = require("../controllers/account/account.controller");
const configController = require("../controllers/config/config.controller");
const jobTrafficController = require("../controllers/jobtraffic/jobtraffic.controller");
const coinController = require("../controllers/coin/coin.controller");
const moneyController = require("../controllers/money/money.controller");
const validateUser = require("../requests/validate.user");
const isAuth = require("../utils/validatetoken.util");

//User Apis

router.post(
  "/register",
  validateUser.register(),
  userAccountController.register
);
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
  "/save-actionconfig",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  configController.saveDataActionConfig
);

router.post(
  "/save-ipconfig",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  configController.saveDataIpConfig
);

router.get(
  "/actionconfig",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  configController.showActionConfig
);

router.get(
  "/ipconfig",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  configController.showIpConfig
);

router.put(
  "/delete-actionconfig",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  configController.deleteActionConfig
);

router.put(
  "/delete-ipconfig",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  configController.deleteIpConfig
);

router.put(
  "/update-actionconfig",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  configController.updateActionConfig
);

router.put(
  "/update-ipconfig",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  configController.updateIpConfig
);

router.post(
  "/createjob",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  jobTrafficController.createJob,
  coinController.createTxHistory
);

router.get(
  "/createdjob",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  jobTrafficController.showAllCreatedJob
);

router.put(
  "/deletejob",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  jobTrafficController.deleteJob
);

router.post(
  "/assignjob",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  jobTrafficController.assignJob
);

router.put(
  "/updatejobdetail",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  jobTrafficController.checkJobDetail
);

router.put(
  "/returnjobdetail",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  jobTrafficController.returnJobDetail
);

router.get(
  "/showjobdetail",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  jobTrafficController.showAllDetailedJob
);

router.get(
  "/listjob",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  jobTrafficController.showListJob
);

router.get(
  "/listdonejob",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  jobTrafficController.showListDoneJob
);

router.get(
  "/coinBalance",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  coinController.coinBalance
);

router.post(
  "/create-coinTxHistory",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  coinController.createTxHistory
);

router.get(
  "/show-coinTxHistory",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  coinController.showCoinHistory
);

router.post(
  "/create-moneyTxHistory",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  moneyController.createTxHistory
);

router.get(
  "/show-moneyTxHistory",
  isAuth.validateToken,
  validateUser.checkAccessToken,
  moneyController.showMoneyHistory
);

module.exports = router;
