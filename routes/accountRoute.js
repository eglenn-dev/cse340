const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/index");

// Assuming 'viewAccount' is the function to handle "My Account" page
router.get("/login", accountController.buildLogin, utilities.handleErrors);
router.get("/register", accountController.buildRegister, utilities.handleErrors);

module.exports = router;