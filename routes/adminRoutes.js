const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const uploadController = require('../controllers/uploadController');
const { authMiddleware, sellerMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post(
  '/upload',
  authMiddleware,
  sellerMiddleware,
  upload.single('image'),
  uploadController.uploadImage
);

// Create a new product (accessible only to seller accounts)
router.post('/products', authMiddleware, sellerMiddleware, productController.createProduct);

// Update a product (accessible only to seller accounts)
router.patch('/products/:id', authMiddleware, sellerMiddleware, productController.updateProduct);

// Delete a product (accessible only to seller accounts)
router.delete('/products/:id', authMiddleware, sellerMiddleware, productController.deleteProduct);

router.get('/', authMiddleware, sellerMiddleware, productController.getProducts);


module.exports = router;
