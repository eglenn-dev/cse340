const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.nameRules = () => {
    console.log("Made it to nameRules()")
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .matches(/^[A-Za-z0-9]+$/, "i")
            .withMessage("Please enter a valid name.")
    ];
}

validate.checkName = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            errors,
            nav
        });
        return;
    }
    next();
}

module.exports = { validate }