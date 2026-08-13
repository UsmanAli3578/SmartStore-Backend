const pool = require('../config/db');

const createProduct = async (name, description, price, seller_id, image) => {
	const result = await pool.query(
		`INSERT INTO products( name, description,price,seller_id,image) VALUES($1, $2, $3,$4,$5) RETURNING *;`,
		[name, description, price, seller_id, image],
	);
	return result.rows[0];
};

const getProducts = async () => {
	const result = await pool.query(`SELECT * FROM products`);
	return result.rows;
};
const getProductById = async (id) => {
	const result = await pool.query(`SELECT * FROM products WHERE id = $1`, [
		id,
	]);

	return result.rows[0];
};

module.exports = { createProduct, getProducts };
