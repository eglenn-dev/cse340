const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/index");
const { validate } = require('../utilities/account-validation');

router.get("/login", accountController.buildLogin, utilities.handleErrors);
// router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))
router.post("/login", utilities.handleErrors(accountController.accountLogin))
router.get("/register", accountController.buildRegister, utilities.handleErrors);
router.post(
    "/register",
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
router.get('/update/:id', accountController.buildAccountUpdate, utilities.handleErrors);
router.post("/update/:id", validate.updateAccountRules(), validate.checkUpdateData, utilities.handleErrors(accountController.processAccountUpdate));
router.post("/password/:id", validate.passwordUpdateRules(), validate.checkPasswordUpdateData, utilities.handleErrors(accountController.processPasswordChange));
router.get("/", utilities.checkLogin, accountController.buildLoggedIn, utilities.handleErrors);

module.exports = router;