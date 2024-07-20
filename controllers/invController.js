const invModel = require("../models/inventory-model");
const reviewModel = require("../models/review-model");
const utilities = require("../utilities/");

const invCont = {};

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
        title: className + " Vehicles",
        nav,
        grid,
    });
}

invCont.buildByInvId = async function (req, res, next) {
    const invId = req.params.invId;
    const data = await invModel.getInventoryById(invId);
    const detailHTML = await utilities.buildInventoryDetail(data);
    let nav = await utilities.getNav();
    const reviewsList = await utilities.buildReviewList(invId);
    try {
        res.render("./inventory/detail", {
            title: `${data.inv_make} ${data.inv_model}`,
            nav,
            detailHTML,
            invId: req.params.invId,
            reviewsList,
        });
    } catch (error) {
        console.error(`Error at: "${req.originalUrl}" - Status: 404 - Message: ${error.message}`);
        res.render("./errors/error", {
            title: `Vehicle Not Found`,
            nav,
            message: `Vehicle with ID ${invId} not found.`
        })
    }
}

invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect
    });
}

invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

invCont.buildAddClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav
    });
}

invCont.addClassification = async (req, res, next) => {

    const createResult = await invModel.insertClassification(req.body.classification_name);

    if (createResult) {
        req.flash("notice", "Classification added successfully.");
        res.status(201).redirect("/inv");
    } else {
        req.flash("notice", "Sorry, there was an error adding the classification.");
        res.status(500).redirect("/inv/add-classification");
    }
}

invCont.buildAddInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classifications = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
        title: "New Vehicle Form",
        nav,
        classifications
    });
}

invCont.addToInventory = async (req, res, next) => {
    let nav = await utilities.getNav();
    let classifications = await utilities.buildClassificationList();
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body;

    const createResult = await invModel.insertIntoInventory(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id);

    if (createResult) {
        req.flash("notice", "Vehicle added successfully.");
        res.status(201).redirect("/inv");
    } else {
        req.flash("notice", "Sorry, there was an error adding the vehicle.");
        res.status(500).render("./inventory/add-inventory", {
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
    }
}

invCont.buildEditInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classifications: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classifications: classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}

invCont.buildDeleteConfirmationView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    try {
        const itemData = await invModel.getInventoryById(inv_id);
        const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
        res.render("./inventory/delete-confirmation", {
            title: "Confirm Delete " + itemName,
            nav,
            errors: null,
            inv_id: itemData.inv_id,
            inv_make: itemData.inv_make,
            inv_model: itemData.inv_model,
            inv_year: itemData.inv_year,
            inv_price: itemData.inv_price,
        });
    } catch (error) {
        console.error(`Error at: "${req.originalUrl}" - Status: 404 - Message: ${error.message}`);
        res.status(404).render("./errors/error", {
            title: "Inventory Item Not Found",
            nav,
            message: `The inventory item with ID ${inv_id} was not found.`
        });
    }
}

invCont.deleteInventoryItem = async function (req, res, next) {
    const inv_id = parseInt(req.body.inv_id);
    try {
        const deleteResult = await invModel.deleteInventoryById(inv_id);
        if (deleteResult) {
            req.flash("notice", "Inventory item deleted successfully.");
            res.redirect("/inv");
        } else {
            throw new Error("Delete failed");
        }
    } catch (error) {
        console.error(`Error at: "${req.originalUrl}" - Status: 500 - Message: ${error.message}`);
        req.flash("error", "Sorry, there was an error deleting the inventory item.");
        res.redirect(`/inv/delete-confirmation/${inv_id}`);
    }
}

module.exports = invCont;