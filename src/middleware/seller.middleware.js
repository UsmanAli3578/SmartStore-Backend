const sellerMiddleware = (req, res, next) => {
	if (req.user.role !== 'seller') {
		return res.status(403).json({
			message: 'Access denied. seller only.',
		});
	}

	next();
};
module.exports = sellerMiddleware;
