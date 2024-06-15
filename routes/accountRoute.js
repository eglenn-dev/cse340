const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/index");
const { validate } = require('../utilities/account-validation');

// Assuming 'viewAccount' is the function to handle "My Account" page
router.get("/login", accountController.buildLogin, utilities.handleErrors);
router.get("/register", accountController.buildRegister, utilities.handleErrors);
router.post(
    "/register",
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;