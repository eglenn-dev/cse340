const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const reviewModel = require("../models/review-model")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

validate.updateAccountRules = (req, res, next) => {
    return [
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists && account_email !== req.body.account_email) {
                    throw new Error("Email exists. Please use a different email")
                }
            }),
    ];
};

validate.passwordUpdateRules = () => {
    return [
        body("current_password")
            .trim()
            .notEmpty()
            .withMessage("Please provide your current password."),

        body("new_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("New password does not meet requirements."),

        body("confirm_password")
            .trim()
            .notEmpty()
            .custom((value, { req }) => {
                if (value !== req.body.new_password) {
                    throw new Error("Passwords do not match.");
                }
                return true;
            }),
    ];
};

validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        });
        return;
    }
    next();
};

validate.checkPasswordUpdateData = async (req, res, next) => {
    const { current_password, new_password, confirm_password } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error(errors);
        let nav = await utilities.getNav();
        res.render("account/update", {
            errors,
            title: "Update Password",
            nav,
        });
        return;
    }
    next();
};

validate.checkUserUpdatePermissions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await reviewModel.getReviewById(id);
        if (!review) {
            req.flash("notice", "Review not found.");
            res.redirect("/account/");
            return;
        }
        if (review.account_id !== res.locals.accountData.account_id) {
            req.flash("notice", "You do not have permission to update this review.");
            res.redirect("/account/");
            return;
        }
        next();
    } catch (e) {
        console.error(e);
        res.redirect("/account/");
    }
}

validate.checkUserReviewUpdate = async (req, res, next) => {
    try {
        const { review_id } = req.body;
        const review = await reviewModel.getReviewById(review_id);
        if (!review) {
            req.flash("notice", "Review not found.");
            res.redirect("/account/");
            return;
        }
        if (review.account_id !== res.locals.accountData.account_id) {
            req.flash("notice", "You do not have permission to update this review.");
            res.redirect("/account/");
            return;
        }
        next();
    } catch (e) {
        console.error(e);
        req.flash("notice", "Failed to update review.");
        res.redirect("/account/");
    }
}

module.exports = { validate };