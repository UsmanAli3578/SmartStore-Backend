const cartModel = require('../models/cart.model');

async function addToCart(req, res) {
	const user_id = req.user.id;
	const { product_id, quantity } = req.body;

	const cartItem = await cartModel.addToCart(user_id, product_id, quantity);

	if (cartItem.error === 'PRODUCT_NOT_FOUND') {
		return res.status(404).json({
			message: 'Product not found',
		});
	}

	if (cartItem.error === 'OWN_PRODUCT') {
		return res.status(403).json({
			message: 'You cannot add your own product to cart',
		});
	}

	return res.status(201).json({
		message: 'Product added to cart successfully',
		cartItem: cartItem,
	});
}

async function getCart(req, res) {
	const user_id = req.user.id;

	const cartItems = await cartModel.getCartByUser(user_id);

	return res.status(200).json({
		cart: cartItems,
	});
}
async function removeFromCart(req, res) {
	const user_id = req.user.id;
	const { product_id } = req.params;

	const removedItem = await cartModel.removeFromCart(user_id, product_id);

	if (!removedItem) {
		return res.status(404).json({
			message: 'This item was not in your cart',
		});
	}

	return res.status(200).json({
		message: 'Product removed from cart successfully',
		removedItem: removedItem,
	});
}

async function updateQuantity(req, res) {
	const user_id = req.user.id;
	const { product_id } = req.params;
	const { quantity } = req.body;

	if (!quantity || quantity < 1) {
		return res.status(400).json({
			message: 'Quantity must be at least 1',
		});
	}

	const updatedItem = await cartModel.updateQuantity(
		user_id,
		product_id,
		quantity,
	);

	if (!updatedItem) {
		return res.status(404).json({
			message: 'This item was not in your cart',
		});
	}

	return res.status(200).json({
		message: 'Quantity updated successfully',
		cartItem: updatedItem,
	});
}

module.exports = {
	addToCart,
	getCart,
	removeFromCart,
	updateQuantity,
};
