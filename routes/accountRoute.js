const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities/index");
const { validate } = require('../utilities/account-validation');

router.get("/login", accountController.buildLogin, utilities.handleErrors);
router.post("/login", utilities.handleErrors(accountController.accountLogin))
router.get("/register", accountController.buildRegister, utilities.handleErrors);
router.post(
    "/register",
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
router.get('/update-review/:id', validate.checkUserUpdatePermissions, reviewController.buildUpdateReview, utilities.handleErrors);
router.get('/delete-review/:id', validate.checkUserUpdatePermissions, utilities.handleErrors(reviewController.processDeleteReview));
router.post('/update-review', validate.checkUserReviewUpdate, utilities.handleErrors(reviewController.processUpdateReview));
router.get('/update/:id', accountController.buildAccountUpdate, utilities.handleErrors);
router.post("/update", validate.updateAccountRules(), validate.checkUpdateData, utilities.handleErrors(accountController.processAccountUpdate));
router.post("/password", validate.passwordUpdateRules(), validate.checkPasswordUpdateData, utilities.handleErrors(accountController.processPasswordChange));
router.get("/logout", accountController.accountLogout);
router.get("/", utilities.checkLogin, accountController.buildLoggedIn, utilities.handleErrors);

module.exports = router;