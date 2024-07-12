const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
*  Delivering the login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

async function buildLoggedIn(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/index", {
        title: "Account",
        nav,
    })
}

async function buildAccountUpdate(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/update", {
        title: "Update Account",
        nav,
    })
}

async function processAccountUpdate(req, res, next) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body

    const updateResult = await accountModel.updateAccountInfo(
        account_id,
        account_firstname,
        account_lastname,
        account_email
    )

    if (updateResult) {
        req.flash("notice", "Account updated successfully.")
        console.log(updateResult);
        res.locals.accountData = updateResult;
        delete updateResult.account_password
        const accessToken = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 3600 * 1000,
        })
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        res.redirect("/account")
    } else {
        req.flash("notice", "Failed to update account.")
        res.redirect("/account/update")
    }
}

async function accountLogout(req, res, next) {
    res.clearCookie("jwt")
    req.flash("notice", "You have been logged out.")
    res.redirect("/")
}

async function processPasswordChange(req, res, next) {
    const { current_password, new_password, account_id } = req.body
    console.log(account_id);

    const accountData = await accountModel.getAccountById(account_id)
    if (!accountData) {
        req.flash("notice", "Account not found.")
        res.redirect("/account/update")
        return
    }

    try {
        if (await bcrypt.compare(current_password, accountData.account_password)) {
            const hashedPassword = await bcrypt.hashSync(new_password, 10)
            const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
            if (updateResult) {
                req.flash("notice", "Password changed successfully.")
                res.redirect("/account/")
            } else {
                req.flash("notice", "Failed to change password.")
                res.redirect("/account/update")
            }
        } else {
            req.flash("notice", "Incorrect current password.")
            res.redirect("/account/update")
        }
    } catch (error) {
        req.flash("notice", "Failed to change password.")
        res.redirect("/account/update")
    }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res, next) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}



module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildLoggedIn, buildAccountUpdate, processAccountUpdate, processPasswordChange, accountLogout }