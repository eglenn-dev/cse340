const pool = require("../database/");

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = { getClassifications };

async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `
                SELECT * FROM public.inventory AS i 
                JOIN public.classification AS c 
                ON i.classification_id = c.classification_id 
                WHERE i.classification_id = $1
            `,
            [classification_id]
        );
        return data.rows;
    } catch (error) {
        console.error("getclassificationsbyid error " + error);
    }
}

async function getInventoryById(inv_id) {
    try {
        const data = await pool.query(
            `
                SELECT *
                FROM public.inventory
                WHERE inv_id = $1
            `,
            [inv_id]
        );
        if (data.rows[0] === undefined) {
            console.error("No matching vehicle found");
            throw new Error("No matching vehicle found");
        }
        return data.rows[0];
    } catch (error) {
        console.error("getInventoryById error " + error);
    }
}

async function insertClassification(classificationName) {
    const result = await pool.query(
        "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *",
        [classificationName]
    );
    return result.rows[0];
}

async function insertIntoInventory(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id) {
    const inv_image = "/images/vehicles/no-image.png";
    const inv_thumbnail = "/images/vehicles/no-image-tn.png";
    const result = await pool.query(
        `
            INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `,
        [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]
    );
    return result;
}

async function updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
) {
    try {
        const sql =
            "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_price = $4, inv_year = $5, inv_miles = $6, inv_color = $7, classification_id = $8 WHERE inv_id = $9 RETURNING *"
        const data = await pool.query(sql, [
            inv_make,
            inv_model,
            inv_description,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
            inv_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

async function deleteInventoryById(inv_id) {
    try {
        const sql = 'DELETE FROM inventory WHERE inv_id = $1';
        const data = await pool.query(sql, [inv_id]);
        return data;
    } catch (error) {
        console.error("model error: " + error)
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

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, insertClassification, insertIntoInventory, updateInventory, deleteInventoryById, getReviewsByInventoryId };