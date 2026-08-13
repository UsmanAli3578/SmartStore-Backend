const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const router = express.Router();
const userController = require('../controllers/users.controller');

router.get('/allusers', userController.getUsers);
router.get('/user/:id', userController.getUserById);
router.put('/updatedUser/:id', userController.updateUser);
router.delete(
	'/deleteuser/:id',
	authMiddleware,
	adminMiddleware,
	userController.deleteUser,
);

module.exports = router;
