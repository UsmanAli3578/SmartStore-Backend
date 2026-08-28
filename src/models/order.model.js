const pool = require('../config/db');

const createOrder = async (userId, totalPrice) => {
	const result = await pool.query(
		`INSERT INTO orders (user_id, total_price)
		 VALUES ($1, $2)
		 RETURNING *;`,
		[userId, totalPrice],
	);

	return result.rows[0];
};

const getCartItemsForOrder = async (userId) => {
	const result = await pool.query(
		`SELECT 
			ci.product_id,
			ci.quantity,
			p.name,
			p.price,
			p.image,
			p.seller_id
		 FROM cart_items ci
		 JOIN products p ON p.id = ci.product_id
		 WHERE ci.user_id = $1
		 ORDER BY ci.created_at DESC`,
		[userId],
	);

	return result.rows;
};

const createOrderItems = async (orderId, cartItems) => {
	for (const item of cartItems) {
		await pool.query(
			`INSERT INTO order_items
				(order_id, product_id, quantity, price)
			 VALUES ($1, $2, $3, $4)`,
			[orderId, item.product_id, item.quantity, item.price],
		);
	}
};

const getOrdersBySeller = async (sellerId) => {
	const result = await pool.query(
		`SELECT
			o.id AS order_id,
			o.user_id,
			o.total_price,
			o.status AS order_status,
			o.created_at,

			oi.id AS order_item_id,
			oi.product_id,
			oi.quantity,
			oi.price,
			oi.status AS item_status,

			p.name AS product_name,
			p.image AS product_image

		 FROM orders o
		 JOIN order_items oi ON oi.order_id = o.id
		 JOIN products p ON p.id = oi.product_id
		 WHERE p.seller_id = $1
		 ORDER BY o.created_at DESC`,
		[sellerId],
	);

	return result.rows;
};

const approveOrderItem = async (orderItemId, sellerId) => {
	const result = await pool.query(
		`UPDATE order_items oi
		 SET status = 'approved'
		 FROM products p
		 WHERE oi.id = $1
		 AND oi.product_id = p.id
		 AND p.seller_id = $2
		 RETURNING oi.*`,
		[orderItemId, sellerId],
	);

	return result.rows[0];
};

const getOrdersByUser = async (userId) => {
	const result = await pool.query(
		`SELECT
			o.id AS order_id,
			o.total_price,
			o.status AS order_status,
			o.created_at,
			oi.id AS order_item_id,
			oi.product_id,
			oi.quantity,
			oi.price,
			oi.status AS item_status,
			p.name AS product_name,
			p.image AS product_image
		 FROM orders o
		 JOIN order_items oi ON oi.order_id = o.id
		 JOIN products p ON p.id = oi.product_id
		 WHERE o.user_id = $1
		 ORDER BY o.created_at DESC`,
		[userId],
	);

	return result.rows;
};

const updateOrderStatus = async (orderId) => {
	const result = await pool.query(
		`UPDATE orders
		 SET status = 'approved'
		 WHERE id = $1
		 AND NOT EXISTS (
			SELECT 1
			FROM order_items
			WHERE order_id = $1
			AND status != 'approved'
		 )
		 RETURNING *`,
		[orderId],
	);

	return result.rows[0];
};

module.exports = {
	createOrder,
	getCartItemsForOrder,
	createOrderItems,
	getOrdersBySeller,
	approveOrderItem,
	getOrdersByUser,
	updateOrderStatus,
};
