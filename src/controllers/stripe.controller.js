const stripe = require('../config/stripe');

const {
	createOrder,
	getCartItemsForOrder,
	createOrderItems,
	getOrderByPaymentIntentId,
} = require('../models/order.model');

const { clearCart } = require('../models/cart.model');

const handleStripeWebhook = async (req, res) => {
	try {
		const signature = req.headers['stripe-signature'];

		const event = stripe.webhooks.constructEvent(
			req.body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET,
		);

		console.log('Stripe webhook received:', event.type);

		if (event.type === 'payment_intent.succeeded') {
			const paymentIntent = event.data.object;

			const userId = paymentIntent.metadata.userId;

			console.log('Payment succeeded. User ID:', userId);

			const existingOrder = await getOrderByPaymentIntentId(
				paymentIntent.id,
			);

			if (existingOrder) {
				console.log(
					'Order already exists for PaymentIntent:',
					paymentIntent.id,
				);

				return res.status(200).json({
					received: true,
				});
			}

			// User ka cart nikalo
			const cartItems = await getCartItemsForOrder(userId);

			if (cartItems.length === 0) {
				console.log('Cart is empty for user:', userId);

				return res.status(200).json({
					received: true,
				});
			}

			// Total calculate karo
			const totalPrice = cartItems.reduce(
				(sum, item) => sum + Number(item.price) * item.quantity,
				0,
			);

			// Order create karo
			const order = await createOrder(
				userId,
				totalPrice,
				paymentIntent.id,
			);

			// Order items create karo
			await createOrderItems(order.id, cartItems);

			// Cart clear karo
			await clearCart(userId);

			console.log('Order created successfully:', order.id);
		}

		return res.status(200).json({
			received: true,
		});
	} catch (error) {
		console.error('Webhook error:', error.message);

		return res.status(400).json({
			message: 'Webhook signature verification failed',
		});
	}
};

module.exports = {
	handleStripeWebhook,
};
