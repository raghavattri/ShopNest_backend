const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, sellerMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/my-orders', authMiddleware, orderController.getMyOrders);
router.get('/', authMiddleware, sellerMiddleware, orderController.getAllOrders);
router.patch('/:id/status', authMiddleware, sellerMiddleware, orderController.updateOrderStatus);

module.exports = router;
