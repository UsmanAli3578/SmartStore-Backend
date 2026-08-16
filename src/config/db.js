// const { Pool } = require('pg');
// require('dotenv').config();
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_PORT:', process.env.DB_PORT);
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('DB_USER:', process.env.DB_USER);

// const pool = new Pool({
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASSWORD,
// 	host: process.env.DB_HOST,
// 	port: process.env.DB_PORT,
// 	database: process.env.DB_NAME,
// });

// pool.connect()
// 	.then(() => {
// 		console.log('PostgreSQL connected');
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

// module.exports = pool;

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

pool.connect()
	.then(() => {
		console.log('PostgreSQL connected');
	})
	.catch((err) => {
		console.log(err);
	});

module.exports = pool;
