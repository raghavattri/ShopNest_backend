const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, sellerMiddleware } = require('../middleware/authMiddleware');

// Get all products
router.get('/', productController.getProducts);

// Get a single product
router.get('/:id', productController.getProductById);

// Create a new product
router.post('/', authMiddleware, sellerMiddleware, productController.createProduct);

// Update a product
router.patch('/:id', authMiddleware, sellerMiddleware, productController.updateProduct);

// Delete a product
router.delete('/:id', authMiddleware, sellerMiddleware, productController.deleteProduct);

module.exports = router;
