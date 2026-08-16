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

const getProductsBySellerId = async (seller_id) => {
	const result = await pool.query(
		`SELECT * FROM products WHERE seller_id = $1`,
		[seller_id],
	);

	return result.rows;
};

const EditProduct = async (
	product_id,
	seller_id,
	name,
	description,
	price,
	image,
) => {
	const result = await pool.query(
		`UPDATE products
		 SET name = $1,
		     description = $2,
		     price = $3,
		     image = COALESCE($4, image)
		 WHERE id = $5 AND seller_id = $6
		 RETURNING *;`,
		[name, description, price, image, product_id, seller_id],
	);
	return result.rows[0];
};

const DeleteProduct = async (product_id, seller_id) => {
	const result = await pool.query(
		`DELETE FROM products
		 WHERE id = $1 AND seller_id = $2
		 RETURNING *;`,
		[product_id, seller_id],
	);
	return result.rows[0];
};

module.exports = {
	createProduct,
	getProducts,
	getProductsBySellerId,
	EditProduct,
	DeleteProduct,
};
