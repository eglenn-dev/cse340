const pool = require("../database/");

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

async function getReviewsByInventoryId(inv_id) {
    try {
        const data = await pool.query(
            `
                SELECT * FROM public.reviews
                WHERE inv_id = $1
            `,
            [inv_id]
        );
        return data.rows;
    } catch (error) {
        console.error("getReviewsByInventoryId error " + error);
    }
}

async function insertReview(review_rating, review_text, inv_id, account_id) {
    try {
        const sql = "INSERT INTO public.reviews (review_rating, review_text, inv_id, account_id) VALUES ($1, $2, $3, $4) RETURNING *";
        const data = await pool.query(sql, [review_rating, review_text, inv_id, account_id]);
        return data.rows[0];
    } catch (error) {
        console.error("insertReview error " + error);
    }

}

async function deleteReview(review_id) {
    try {
        const sql = "DELETE FROM reviews WHERE review_id = $1"
        const result = await pool.query(sql, [review_id])
        return result;
    } catch (error) {
        return error.message;
    }

}

module.exports = { getUserReviews, getReviewById, updateReview, getReviewsByInventoryId, insertReview, deleteReview }