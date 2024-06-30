const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const { validate } = require("../utilities/inv-validation");

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInvId);
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/add-classification", invController.buildAddClassificationView);
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventoryView));
router.post(
    "/update/",
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));
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
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteConfirmationView));
router.post("/delete", utilities.handleErrors(invController.deleteInventoryItem));
router.get("/", invController.buildManagementView);

module.exports = router;