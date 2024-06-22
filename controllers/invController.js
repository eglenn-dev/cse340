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
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav
    });
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

module.exports = invCont;