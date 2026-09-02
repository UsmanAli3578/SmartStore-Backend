const express = require('express');

const router = express.Router();

const {
	handleStripeWebhook,
} = require('../controllers/stripe.controller');

router.post(
	'/webhook',
	express.raw({ type: 'application/json' }),
	handleStripeWebhook,
);

module.exports = router;