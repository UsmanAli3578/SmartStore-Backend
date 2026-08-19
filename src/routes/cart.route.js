const express = require('express');
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/add', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getCart);
router.delete(
	'/remove/:product_id',
	authMiddleware,
	cartController.removeFromCart,
);
router.put(
	'/update/:product_id',
	authMiddleware,
	cartController.updateQuantity,
);

module.exports = router;
