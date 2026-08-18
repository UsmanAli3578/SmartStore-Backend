const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
async function userRegister(req, res) {
	const { name, email, password, role } = req.body;

	if (role !== 'user' && role !== 'seller') {
		return res.status(400).json({
			message: 'Role must be either user or seller',
		});
	}

	const hash = await bcrypt.hash(password, 10);

	const user = await userModel.createUser(name, email, hash, role);

	const token = jwt.sign(
		{ id: user.id, email: user.email, role: user.role },
		process.env.JWT_SECRET,
	);

	// res.cookie('token', token);

	res.cookie('token', token, {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
	});

	const { password: _, ...userWithoutPassword } = user;

	return res.status(201).json({
		message: 'User registered successfully',
		user: userWithoutPassword,
	});
}

async function userLogin(req, res) {
	const { email, password } = req.body;

	const user = await userModel.getUserByEmail(email);

	if (!user) {
		return res.status(401).json({
			message: 'User not user available ',
		});
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		return res.status(401).json({ message: 'invalid password' });
	}

	const token = jwt.sign(
		{ id: user.id, email: user.email, role: user.role },
		process.env.JWT_SECRET,
	);

	// res.cookie('token', token);
	res.cookie('token', token, {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
	});

	const { password: _, ...userWithoutPassword } = user;

	res.status(201).json({
		message: 'User logged in successfully',
		user: userWithoutPassword,
	});
}

module.exports = { userRegister, userLogin };
