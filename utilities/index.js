const invModel = require("../models/inventory-model");
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

// Add this function to utilities/index.js
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
        return detailHTML;
    } catch (error) {
        console.error("buildInventoryDetail error " + error);
        return (`
            <p class="notice">Sorry, no matching vehicles could be found.</p>    
        `);
    }
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;