const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/register', authController.userRegister);
router.post('/login', authController.userLogin);
router.get('/me', authMiddleware, authController.getCurrentUser);
router.post('/logout', authController.userLogout);
router.put(
	'/avatar',
	authMiddleware,
	upload.single('avatar'),
	authController.updateAvatar,
);

module.exports = router;
