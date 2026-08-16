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

async function getProductsBySellerId(req, res) {
	const seller_id = req.user.id;
	const products = await productModel.getProductsBySellerId(seller_id);

	return res.status(200).json({
		products,
	});
}

async function editProduct(req, res) {
	const product_id = req.params.id;
	const seller_id = req.user.id;

	const { name, description, price } = req.body;
	let image = null;

	if (req.file) {
		const uploadedImage = await imagekit.files.upload({
			file: req.file.buffer.toString('base64'),
			fileName: req.file.originalname,
			folder: '/products',
		});

		image = uploadedImage.url;
	}

	const updatedProduct = await productModel.EditProduct(
		product_id,
		seller_id,
		name,
		description,
		price,
		image,
	);

	if (!updatedProduct) {
		return res.status(404).json({
			message: 'Product not found or you are not the owner',
		});
	}

	return res.status(200).json({
		message: 'Product updated successfully',
		product: updatedProduct,
	});
}

async function deleteProduct(req, res) {
	const product_id = req.params.id;
	const seller_id = req.user.id;

	const deletedProduct = await productModel.DeleteProduct(
		product_id,
		seller_id,
	);

	if (!deletedProduct) {
		return res.status(404).json({
			message: 'Product not found or you are not the owner',
		});
	}

	return res.status(200).json({
		message: 'Product deleted successfully',
		product: deletedProduct,
	});
}

module.exports = {
	createProduct,
	getProducts,
	getProductsBySellerId,
	editProduct,
	deleteProduct,
};
