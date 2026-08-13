const productModel = require('../models/product.model');
const imagekit = require('../config/imagekit');

async function createProduct(req, res) {
	const { name, description, price } = req.body;
	const seller_id = req.user.id;

	const uploadedImage = await imagekit.files.upload({
		file: req.file.buffer.toString('base64'),
		fileName: req.file.originalname,
		folder: '/products',
	});

	const image = uploadedImage.url;

	const productCreated = await productModel.createProduct(
		name,
		description,
		price,
		seller_id,
		image,
	);
	res.status(201).json({
		message: 'product is create successfully',
		product: productCreated,
	});
}

async function getProducts(req, res) {
	const products = await productModel.getProducts();

	return res.status(200).json({
		products,
	});
}

module.exports = { createProduct, getProducts };
