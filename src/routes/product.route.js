const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const sellerMiddleware = require('../middleware/seller.middleware');
const upload = require('../config/multer');
const productController = require('../controllers/product.controller');

const router = express.Router();

router.post(
	'/productCreated',
	authMiddleware,
	sellerMiddleware,
	upload.single('image'),
	productController.createProduct,
);

router.get('/allproducts', productController.getProducts);
router.get(
	'/myproducts',
	authMiddleware,
	sellerMiddleware,
	productController.getProductsBySellerId,
);

router.put(
	'/editproduct/:id',
	authMiddleware,
	sellerMiddleware,
	upload.single('image'),
	productController.editProduct,
);

router.delete(
	'/deleteproduct/:id',
	authMiddleware,
	sellerMiddleware,
	productController.deleteProduct,
);

module.exports = router;
