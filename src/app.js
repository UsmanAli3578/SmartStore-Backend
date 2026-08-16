const express = require('express');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/users.route');
const productRouter = require('./routes/product.route');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(cookieParser());

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	}),
);
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth/', authRouter);
app.use('/api/users/', userRouter);
app.use('/api/product/', productRouter);

module.exports = app;
