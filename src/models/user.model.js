const pool = require('../config/db');

const createUser = async (name, email, password, role) => {
	const result = await pool.query(
		`INSERT INTO users(name, email, password,role) VALUES($1, $2, $3,$4) RETURNING *;`,
		[name, email, password, role],
	);

	return result.rows[0];
};

const getAllUsers = async () => {
	const result = await pool.query(`SELECT * FROM users`);
	return result.rows;
};

const getUserById = async (id) => {
	const result = await pool.query(` SELECT * FROM users WHERE id = $1;`, [
		id,
	]);
	return result.rows[0];
};

const updateUser = async (id, name, email) => {
	const result = await pool.query(
		`UPDATE users SET name = $1, email = $2  WHERE id = $3 RETURNING *`,
		[name, email, id],
	);

	return result.rows[0];
};

const deleteUser = async (id) => {
	const result = await pool.query(
		`DELETE FROM users WHERE id = $1 RETURNING *`,
		[id],
	);
	return result.rows[0];
};

const getUserByEmail = async (email) => {
	const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
		email,
	]);

	return result.rows[0];
};

module.exports = {
	createUser,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	getUserByEmail,
};
