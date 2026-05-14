const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  selectedColor: String,
  selectedSize: String
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      }
    },
    subtotal: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Placed'
    },
    inventoryAdjusted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
