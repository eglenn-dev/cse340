const invModel = require("../models/inventory-model");
const reviewModel = require("../models/review-model");
const utilities = require("../utilities/");

async function buildUpdateReview(req, res, next) {
    let nav = await utilities.getNav()
    const { id } = req.params
    const reviewData = await reviewModel.getReviewById(id)
    const inventoryData = await invModel.getInventoryById(reviewData.inv_id)
    res.render("account/update-review", {
        title: "Update Review",
        nav,
        reviewData,
        vehicleName: inventoryData.inv_make + " " + inventoryData.inv_model,
    })
}

async function processUpdateReview(req, res, next) {
    const { review_id, review_text, review_rating } = req.body
    const updateResult = await reviewModel.updateReview(review_id, review_text, review_rating)
    if (updateResult) {
        req.flash("notice", "Review updated successfully.")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Failed to update review.")
        res.redirect("/account/")
    }
}

async function processDeleteReview(req, res, next) {
    const { id } = req.params
    const deleteResult = await reviewModel.deleteReview(id)
    if (deleteResult) {
        req.flash("notice", "Review deleted successfully.")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Failed to delete review.")
        res.redirect("/account/")
    }
}

async function addReview(req, res, next) {

    const { review_rating, review_text, inv_id, account_id } = req.body;

    const createResult = await reviewModel.insertReview(review_rating, review_text, inv_id, account_id);

    if (createResult) {
        req.flash("notice", "Review added successfully.");
        res.status(201).redirect(`/inv/detail/${inv_id}`);
    } else {
        req.flash("notice", "Sorry, there was an error adding the review.");
        res.status(500).redirect(`/inv/detail/${inv_id}`);
    }
}


module.exports = { buildUpdateReview, processUpdateReview, processDeleteReview, addReview }