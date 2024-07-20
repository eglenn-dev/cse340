const invModel = require("../models/inventory-model");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        if (row.classification_name === "Sport") {
            list += "<li class=\"sport\">";
            list +=
                '<a href="/inv/type/' +
                row.classification_id +
                '" title="See our inventory of ' +
                row.classification_name +
                ' vehicles">' +
                row.classification_name +
                "</a>";
            list += "</li>"
        } else {
            list += "<li>";
            list +=
                '<a href="/inv/type/' +
                row.classification_id +
                '" title="See our inventory of ' +
                row.classification_name +
                ' vehicles">' +
                row.classification_name +
                "</a>";
            list += "</li>"
        }
    })
    list += "</ul>";
    return list;
}


Util.buildClassificationGrid = async function (data) {
    let grid;
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid;
}

Util.buildInventoryDetail = async function (vehicle) {
    try {
        let detailHTML = `<div class="vehicle-detail">`;
        detailHTML += `<h1>${vehicle.inv_make} ${vehicle.inv_model} - ${vehicle.inv_year}</h1>`;
        detailHTML += `<div class="saleGrid">`
        detailHTML += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />`;
        detailHTML += `<div>`
        detailHTML += `<p>${vehicle.inv_description}</p>`;
        detailHTML += `<div>`
        detailHTML += `<strong>Details:</strong>`
        detailHTML += `<ul>`;
        detailHTML += `<li><strong>Make:</string>${vehicle.inv_make}</li>`;
        detailHTML += `<li><strong>Model:</string>${vehicle.inv_model}</li>`;
        detailHTML += `<li><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</li>`;
        detailHTML += `<li><strong>Color:</strong> ${vehicle.inv_color}</li>`;
        detailHTML += `<li><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</li>`;
        detailHTML += `<li><strong>Year:</strong> ${vehicle.inv_year}</li>`;
        detailHTML += `</ul>`;
        detailHTML += `</div>`
        detailHTML += `</div>`
        detailHTML += `</div>`
        detailHTML += `</div>`;
        detailHTML += `<h3>Reviews of ${vehicle.inv_make} ${vehicle.inv_model}</h3>`;
        return detailHTML;
    } catch (error) {
        console.error("buildInventoryDetail error " + error);
        return (`
            <p class="notice">Sorry, no matching vehicles could be found.</p>    
        `);
    }
}

Util.buildReviewList = async function (invId) {
    try {
        let reviewList = `<ul id="reviews">`;
        const data = await invModel.getReviewsByInventoryId(invId);
        const reviews = await Promise.all(data.reverse().map(async review => {
            const { account_firstname, account_lastname } = await accountModel.getAccountById(review.account_id);
            return `<li>
                        <div>${review.review_text}</div>
                        <div><strong>Rating:</strong> ${review.review_rating}/5</div>
                        <div><strong>Posted by:</strong> ${account_firstname[0]}${account_lastname}</div>
                    </li>`;
        }));

        reviewList += reviews.join('');
        reviewList += `</ul>`;
        return reviewList;
    } catch (e) {
        console.error("buildReviewList error " + e);
        return (`<p class="notice">There are no reviews for this vehicle yet.</p>`);
    }
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                };
                res.locals.accountData = accountData;
                res.locals.loggedin = 1;
                next();
            })
    } else {
        next()
    }
}

Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

Util.checkAccountType = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function (error, decodedToken) {
            if (error) {
                req.flash("Error", "Please log in.");
                return res.redirect("/account/login");
            }
            if (decodedToken.account_type === "Employee" || decodedToken.account_type === "Admin") {
                next();
            } else {
                req.flash("Error", "Access denied. Insufficient permissions.");
                return res.redirect("/account/login");
            }
        });
    } else {
        req.flash("Error", "Please log in.");
        return res.redirect("/account/login");
    }
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;