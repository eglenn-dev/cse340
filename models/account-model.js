const pool = require("../database/");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

async function getAccountById(account_id) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
            [account_id]
        );
        return result.rows[0];
    } catch (error) {
        return new Error("No matching account found");
    }
}

async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
    try {
        const sql = "UPDATE account SET account_firstname = $2, account_lastname = $3, account_email = $4 WHERE account_id = $1 RETURNING *";
        const result = await pool.query(sql, [account_id, account_firstname, account_lastname, account_email]);
        return result.rows[0];
    } catch (error) {
        return error.message;
    }
}

async function updatePassword(account_id, hashedPassword) {
    try {
        const sql = "UPDATE account SET account_password = $2 WHERE account_id = $1 RETURNING *";
        const result = await pool.query(sql, [account_id, hashedPassword]);
        return result.rows[0];
    } catch (error) {
        return error.message;
    }
}

async function getUserReviews(account_id) {
    try {
        const sql = "SELECT review_id, review_text, review_rating FROM reviews WHERE account_id = $1"
        const result = await pool.query(sql, [account_id])
        return result.rows
    } catch (error) {
        return error.message
    }
}

async function getReviewById(review_id) {
    try {
        const sql = "SELECT * FROM reviews WHERE review_id = $1"
        const result = await pool.query(sql, [review_id])
        return result.rows[0]
    } catch (error) {
        return error.message
    }
}

async function updateReview(review_id, review_text, review_rating) {
    try {
        const sql = "UPDATE reviews SET review_text = $2, review_rating = $3 WHERE review_id = $1 RETURNING *"
        const result = await pool.query(sql, [review_id, review_text, review_rating])
        return result.rows[0]
    } catch (error) {
        return error.message
    }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccountInfo, updatePassword, getUserReviews, getReviewById, updateReview };