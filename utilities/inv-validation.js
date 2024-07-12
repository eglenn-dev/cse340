const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.nameRules = () => {
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

validate.newVehicleRules = () => {
    return [
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please enter a make."),
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please enter a model."),
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 4, max: 4 })
            .isInt()
            .withMessage("Please enter a valid year."),
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please enter a description."),
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isInt()
            .withMessage("Please enter a valid price."),
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isInt()
            .withMessage("Please enter a valid mileage."),
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please enter a color."),
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isInt()
            .withMessage("Please select a classification.")
    ];
}

validate.checkNewVehicleData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inv/add-inventory", {
            errors,
            title: "New Vehicle Form",
            nav,
            classifications,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        });
        return;
    }
    next();
}

validate.checkUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inv/edit-inventory", {
            errors,
            title: "Edit Vehicle Form",
            nav,
            classifications,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            inv_id
        });
        return;
    }
    next();
}

module.exports = { validate }