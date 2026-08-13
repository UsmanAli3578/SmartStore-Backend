const userModel = require('../models/user.model');

async function getUsers(req, res) {
	const users = await userModel.getAllUsers();

	return res.status(200).json({
		users: users,
	});
}

async function getUserById(req, res) {
	const id = req.params.id;
	const user = await userModel.getUserById(id);
	return res.status(200).json({
		user: user,
	});
}

async function updateUser(req, res) {
	const id = req.params.id;
	const { name, email } = req.body;

	const updateduser = await userModel.updateUser(id, name, email);

	return res.status(200).json({
		user: updateduser,
	});
}

async function deleteUser(req, res) {
	const id = req.params.id;

	const deleteduser = await userModel.deleteUser(id);

	return res.status(200).json({
		user: deleteduser,
	});
}

module.exports = { getUsers, getUserById, updateUser, deleteUser };
