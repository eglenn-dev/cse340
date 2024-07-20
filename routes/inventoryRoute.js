const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const { validate } = require("../utilities/inv-validation");

// View that do not require authentication
router.get("/detail/:invId", invController.buildByInvId);
router.get("/type/:classificationId", invController.buildByClassificationId);

router.post("/detail/:invId", utilities.checkLogin, utilities.handleErrors(invController.addReview));

router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON))
router.get("/add-classification", utilities.checkAccountType, invController.buildAddClassificationView);
router.get("/edit/:inventory_id", utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventoryView));
router.post(
    "/update/", utilities.checkAccountType,
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));
router.post(
    "/add-classification", utilities.checkAccountType,
    validate.nameRules(),
    validate.checkName,
    utilities.handleErrors(invController.addClassification)
)
router.get("/add-inventory", utilities.checkAccountType, invController.buildAddInventoryView);
router.post(
    "/add-inventory", utilities.checkAccountType,
    validate.newVehicleRules(),
    validate.checkNewVehicleData,
    utilities.handleErrors(invController.addToInventory)
);
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteConfirmationView));
router.post("/delete", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventoryItem));
router.get("/", utilities.checkAccountType, invController.buildManagementView);

module.exports = router;