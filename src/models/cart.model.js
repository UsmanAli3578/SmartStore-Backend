const pool = require('../config/db');

// async function addToCart(user_id, product_id) {
// 	const result = await pool.query(
// 		`INSERT INTO cart_items (user_id, product_id)
// 		 VALUES ($1, $2)
// 		 ON CONFLICT (user_id, product_id)
// 		 DO UPDATE SET quantity = cart_items.quantity + 1
// 		 RETURNING *`,
// 		[user_id, product_id],
// 	);

// 	return result.rows[0];
// }

async function addToCart(user_id, product_id, quantity) {
	// Check whether the logged-in user owns this product
	const productResult = await pool.query(
		`SELECT seller_id
		 FROM products
		 WHERE id = $1`,
		[product_id],
	);

	if (productResult.rows.length === 0) {
		return {
			error: 'PRODUCT_NOT_FOUND',
		};
	}

	const seller_id = productResult.rows[0].seller_id;

	// Seller cannot add their own product to cart
	if (seller_id === user_id) {
		return {
			error: 'OWN_PRODUCT',
		};
	}

	const result = await pool.query(
		`INSERT INTO cart_items (user_id, product_id, quantity)
		 VALUES ($1, $2, $3)
		 ON CONFLICT (user_id, product_id)
		 DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
		 RETURNING *`,
		[user_id, product_id, quantity],
	);

	return result.rows[0];
}

async function getCartByUser(user_id) {
	const result = await pool.query(
		`SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image
		 FROM cart_items ci
		 JOIN products p ON p.id = ci.product_id
		 WHERE ci.user_id = $1
		 ORDER BY ci.created_at DESC`,
		[user_id],
	);

	return result.rows;
}

async function removeFromCart(user_id, product_id) {
	const result = await pool.query(
		`DELETE FROM cart_items
		 WHERE user_id = $1 AND product_id = $2
		 RETURNING *`,
		[user_id, product_id],
	);

	return result.rows[0];
}

async function updateQuantity(user_id, product_id, quantity) {
	const result = await pool.query(
		`UPDATE cart_items
		 SET quantity = $3
		 WHERE user_id = $1 AND product_id = $2
		 RETURNING *`,
		[user_id, product_id, quantity],
	);

	return result.rows[0];
}

async function clearCart(user_id) {
	await pool.query(
		`DELETE FROM cart_items
		 WHERE user_id = $1`,
		[user_id],
	);
}

module.exports = {
	addToCart,
	getCartByUser, 
	removeFromCart,
	updateQuantity,
	clearCart,
};
