const {
	createOrder,
	getCartItemsForOrder,
	createOrderItems,
	getOrdersBySeller,
	approveOrderItem,
	getOrdersByUser,
	updateOrderStatus,
} = require('../models/order.model');

const { clearCart } = require('../models/cart.model');

const checkout = async (req, res) => {
	try {
		const userId = req.user.id;

		// 1. User ka cart nikalo
		const cartItems = await getCartItemsForOrder(userId);

		// 2. Check karo cart empty to nahi
		if (cartItems.length === 0) {
			return res.status(400).json({
				message: 'Your cart is empty',
			});
		}

		// 3. Total calculate karo
		const totalPrice = cartItems.reduce(
			(sum, item) => sum + Number(item.price) * item.quantity,
			0,
		);

		// 4. Orders table mein order create karo
		const order = await createOrder(userId, totalPrice);

		// 5. Order ke products order_items mein save karo
		await createOrderItems(order.id, cartItems);

		await clearCart(userId);

		// 6. Success response
		return res.status(201).json({
			message: 'Order placed successfully',
			order,
		});
	} catch (error) {
		console.error('Checkout error:', error);

		return res.status(500).json({
			message: 'Something went wrong while placing order',
		});
	}
};
const getSellerOrders = async (req, res) => {
	try {
		const sellerId = req.user.id;

		const orders = await getOrdersBySeller(sellerId);

		return res.status(200).json({
			orders,
		});
	} catch (error) {
		console.error('Get seller orders error:', error);

		return res.status(500).json({
			message: 'Something went wrong while getting orders',
		});
	}
};

const approveOrder = async (req, res) => {
	try {
		const sellerId = req.user.id;
		const { orderItemId } = req.params;

		const orderItem = await approveOrderItem(orderItemId, sellerId);

		if (!orderItem) {
			return res.status(404).json({
				message:
					'Order item not found or you are not the seller of this product',
			});
		}

		await updateOrderStatus(orderItem.order_id);

		return res.status(200).json({
			message: 'Order approved successfully',
			orderItem,
		});
	} catch (error) {
		console.error('Approve order error:', error);

		return res.status(500).json({
			message: 'Something went wrong while approving order',
		});
	}
};

const getMyOrders = async (req, res) => {
	try {
		const userId = req.user.id;

		const orders = await getOrdersByUser(userId);

		return res.status(200).json({
			orders,
		});
	} catch (error) {
		console.error('Get my orders error:', error);

		return res.status(500).json({
			message: 'Something went wrong while getting your orders',
		});
	}
};

module.exports = {
	checkout,
	getSellerOrders,
	approveOrder,
	getMyOrders,
};
