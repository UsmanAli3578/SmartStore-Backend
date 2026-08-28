const express = require('express');
const router = express.Router();

const {
	checkout,
	getSellerOrders,
	approveOrder,
    getMyOrders,
} = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');
router.post('/checkout', authMiddleware, checkout);
router.get('/seller-orders', authMiddleware, getSellerOrders);
router.put('/approve/:orderItemId', authMiddleware, approveOrder);
router.get('/my-orders', authMiddleware, getMyOrders);

module.exports = router;
