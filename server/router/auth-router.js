const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");

router.route("/signUp").post(authControllers.signUp);
router.route("/login").post(authControllers.login);
router.route("/forgotCredentials").post(authControllers.forgotCredentials);
router.route("/updateProfile").put(authControllers.updateProfile);
router.route("/trade").put(authControllers.trade);

module.exports = router;