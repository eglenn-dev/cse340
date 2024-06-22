const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const { validate } = require("../utilities/inv-validation");

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInvId);
router.get("/add-classification", invController.buildAddClassificationView);
router.post(
    "/add-classification",
    validate.nameRules(),
    validate.checkName,
    utilities.handleErrors(invController.addClassification)
)
router.get("/add-inventory", invController.buildAddInventoryView);
router.post(
    "/add-inventory",
    validate.newVehicleRules(),
    validate.checkNewVehicleData,
    utilities.handleErrors(invController.addToInventory)
);
router.get("/", invController.buildManagementView);

module.exports = router;