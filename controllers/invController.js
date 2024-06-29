const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    });
}

invCont.buildByInvId = async function (req, res, next) {
    const invId = req.params.invId;
    const data = await invModel.getInventoryById(invId);
    const detailHTML = await utilities.buildInventoryDetail(data);
    let nav = await utilities.getNav();
    try {
        res.render("./inventory/detail", {
            title: `${data.inv_make} ${data.inv_model}`,
            nav,
            detailHTML,
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

module.exports = invCont;