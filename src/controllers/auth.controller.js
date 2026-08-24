const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// async function userRegister(req, res) {
// 	const { name, email, password, role } = req.body;

// 	if (role !== 'user' && role !== 'seller') {
// 		return res.status(400).json({
// 			message: 'Role must be either user or seller',
// 		});
// 	}

// 	const hash = await bcrypt.hash(password, 10);

// 	const user = await userModel.createUser(name, email, hash, role);

// 	const token = jwt.sign(
// 		{ id: user.id, email: user.email, role: user.role },
// 		process.env.JWT_SECRET,
// 	);

// 	// res.cookie('token', token);

// 	res.cookie('token', token, {
// 		httpOnly: true,
// 		secure: true,
// 		sameSite: 'none',
// 	});

// 	const { password: _, ...userWithoutPassword } = user;

// 	return res.status(201).json({
// 		message: 'User registered successfully',
// 		user: userWithoutPassword,
// 	});
// }

async function userRegister(req, res) {
	try {
		const { name, email, password, role } = req.body;

		console.log('BODY:', req.body);

		if (role !== 'user' && role !== 'seller') {
			return res.status(400).json({
				message: 'Role must be either user or seller',
			});
		}

		const existingUser = await userModel.getUserByEmail(email);

		if (existingUser) {
			return res.status(409).json({
				message: 'Email already registered',
			});
		}

		const hash = await bcrypt.hash(password, 10);

		console.log('HASH CREATED');

		const user = await userModel.createUser(name, email, hash, role);

		console.log('USER CREATED:', user);

		const token = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
			process.env.JWT_SECRET,
		);

		console.log('TOKEN CREATED');

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
	} catch (error) {
		console.error('REGISTER ERROR:', error);

		return res.status(500).json({
			message: error.message,
		});
	}
}

async function userLogin(req, res) {
	const { email, password } = req.body;

	const user = await userModel.getUserByEmail(email);

	if (!user) {
		return res.status(404).json({
			message: 'No account found with this email',
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

function getCurrentUser(req, res) {
	return res.json({
		user: req.user,
	});
}

function userLogout(req, res) {
	res.clearCookie('token', {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
	});

	return res.status(200).json({
		message: 'User logged out successfully',
	});
}

module.exports = { userRegister, userLogin, getCurrentUser, userLogout };
