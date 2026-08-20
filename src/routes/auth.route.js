const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/register', authController.userRegister);
router.post('/login', authController.userLogin);
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
