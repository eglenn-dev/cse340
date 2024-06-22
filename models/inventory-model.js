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

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, insertClassification };