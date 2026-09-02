const express = require('express');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/users.route');
const productRouter = require('./routes/product.route');
const cartRoutes = require('./routes/cart.route');
const orderRoutes = require('./routes/order.route');
const stripeRouter = require('./routes/stripe.route');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(cookieParser());

app.use(
	cors({
		origin: [
			'http://localhost:5174',
			'http://localhost:5173',
			'https://frontend-azaad.vercel.app',
		],
		credentials: true,
	}),
);
app.use('/api/stripe', stripeRouter);
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth/', authRouter);
app.use('/api/users/', userRouter);
app.use('/api/product/', productRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

module.exports = app;
