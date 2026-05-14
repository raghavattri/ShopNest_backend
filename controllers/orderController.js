const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, deliveryFee, total } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order must include at least one item' });
    }

    if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.address) {
      return res.status(400).json({ message: 'Shipping details are required' });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      subtotal,
      deliveryFee,
      total
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const shouldReserveStock = ['Confirmed', 'Packed', 'Shipped', 'Delivered'].includes(status);
    const shouldRestoreStock = ['Placed', 'Cancelled'].includes(status) && order.inventoryAdjusted;

    if (shouldReserveStock && !order.inventoryAdjusted) {
      const productIds = order.items.map(item => item.product);
      const products = await Product.find({ _id: { $in: productIds } });
      const productMap = new Map(products.map(product => [String(product._id), product]));

      for (const item of order.items) {
        const product = productMap.get(String(item.product));

        if (!product) {
          return res.status(404).json({ message: `${item.name} is no longer available` });
        }

        if (Number(product.stock) < Number(item.quantity)) {
          return res.status(400).json({ message: `Only ${product.stock} units left for ${item.name}` });
        }
      }

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -Number(item.quantity) } });
      }

      order.inventoryAdjusted = true;
    }

    if (shouldRestoreStock) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: Number(item.quantity) } });
      }

      order.inventoryAdjusted = false;
    }

    order.status = status;
    await order.save();

    const updatedOrder = await order.populate('user', 'username email');
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
