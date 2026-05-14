const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const configureDns = require('../config/dns');

dotenv.config();
configureDns();

const sellerUser = {
  username: 'seller',
  email: 'seller@shopnest.com',
  password: 'Admin@12345',
  role: 'seller'
};

const buyerUsers = [
  {
    username: 'aarav',
    email: 'aarav.buyer@shopnest.com',
    password: 'Buyer@12345',
    role: 'buyer'
  },
  {
    username: 'meera',
    email: 'meera.buyer@shopnest.com',
    password: 'Buyer@12345',
    role: 'buyer'
  },
  {
    username: 'kabir',
    email: 'kabir.buyer@shopnest.com',
    password: 'Buyer@12345',
    role: 'buyer'
  }
];

const products = [
  {
    name: 'Classic White Sneakers',
    category: 'shoes',
    variants: [
      { color: 'white', size: '8' },
      { color: 'white', size: '9' }
    ],
    price: 2499,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Everyday Cotton T-Shirt',
    category: 'clothing',
    variants: [
      { color: 'black', size: 'M' },
      { color: 'navy', size: 'L' }
    ],
    price: 799,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Leather Crossbody Bag',
    category: 'accessories',
    variants: [
      { color: 'brown', size: 'standard' },
      { color: 'black', size: 'standard' }
    ],
    price: 1899,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Wireless Headphones',
    category: 'electronics',
    variants: [
      { color: 'black', size: 'standard' },
      { color: 'silver', size: 'standard' }
    ],
    price: 3299,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Minimal Desk Lamp',
    category: 'home',
    variants: [
      { color: 'white', size: 'medium' },
      { color: 'green', size: 'medium' }
    ],
    price: 1499,
    stock: 16,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Stainless Steel Bottle',
    category: 'accessories',
    variants: [
      { color: 'silver', size: '750ml' },
      { color: 'blue', size: '750ml' }
    ],
    price: 699,
    stock: 42,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Denim Trucker Jacket',
    category: 'clothing',
    variants: [
      { color: 'blue', size: 'M' },
      { color: 'blue', size: 'L' }
    ],
    price: 2199,
    stock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Smart Fitness Watch',
    category: 'electronics',
    variants: [
      { color: 'black', size: '42mm' },
      { color: 'silver', size: '42mm' }
    ],
    price: 4599,
    stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Ceramic Coffee Mug',
    category: 'home',
    variants: [
      { color: 'white', size: '350ml' },
      { color: 'brown', size: '350ml' }
    ],
    price: 449,
    stock: 36,
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Canvas Travel Backpack',
    category: 'accessories',
    variants: [
      { color: 'green', size: 'large' },
      { color: 'black', size: 'large' }
    ],
    price: 2799,
    stock: 11,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Running Performance Shoes',
    category: 'shoes',
    variants: [
      { color: 'black', size: '8' },
      { color: 'red', size: '9' }
    ],
    price: 3499,
    stock: 19,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Linen Summer Shirt',
    category: 'clothing',
    variants: [
      { color: 'white', size: 'M' },
      { color: 'beige', size: 'L' }
    ],
    price: 1199,
    stock: 28,
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Bluetooth Speaker',
    category: 'electronics',
    variants: [
      { color: 'black', size: 'portable' },
      { color: 'blue', size: 'portable' }
    ],
    price: 2299,
    stock: 17,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Wooden Wall Clock',
    category: 'home',
    variants: [
      { color: 'brown', size: 'medium' },
      { color: 'black', size: 'medium' }
    ],
    price: 999,
    stock: 13,
    imageUrl: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Aviator Sunglasses',
    category: 'accessories',
    variants: [
      { color: 'gold', size: 'standard' },
      { color: 'black', size: 'standard' }
    ],
    price: 899,
    stock: 31,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'High Top Canvas Shoes',
    category: 'shoes',
    variants: [
      { color: 'white', size: '8' },
      { color: 'black', size: '9' }
    ],
    price: 1899,
    stock: 24,
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80'
  }
];

const demoOrders = [
  {
    buyerEmail: 'aarav.buyer@shopnest.com',
    status: 'Placed',
    shippingAddress: {
      fullName: 'Aarav Sharma',
      phone: '9876543210',
      address: '221B Park Street, Bengaluru, Karnataka'
    },
    items: [
      { productName: 'Classic White Sneakers', quantity: 1, selectedColor: 'white', selectedSize: '9' },
      { productName: 'Everyday Cotton T-Shirt', quantity: 2, selectedColor: 'black', selectedSize: 'M' }
    ]
  },
  {
    buyerEmail: 'meera.buyer@shopnest.com',
    status: 'Confirmed',
    shippingAddress: {
      fullName: 'Meera Kapoor',
      phone: '9123456780',
      address: 'Flat 12, Marine Drive, Mumbai, Maharashtra'
    },
    items: [
      { productName: 'Leather Crossbody Bag', quantity: 1, selectedColor: 'brown', selectedSize: 'standard' },
      { productName: 'Aviator Sunglasses', quantity: 1, selectedColor: 'gold', selectedSize: 'standard' }
    ]
  },
  {
    buyerEmail: 'kabir.buyer@shopnest.com',
    status: 'Shipped',
    shippingAddress: {
      fullName: 'Kabir Malhotra',
      phone: '9988776655',
      address: '42 Green Avenue, Delhi'
    },
    items: [
      { productName: 'Wireless Headphones', quantity: 1, selectedColor: 'black', selectedSize: 'standard' },
      { productName: 'Stainless Steel Bottle', quantity: 2, selectedColor: 'silver', selectedSize: '750ml' }
    ]
  },
  {
    buyerEmail: 'aarav.buyer@shopnest.com',
    status: 'Packed',
    shippingAddress: {
      fullName: 'Aarav Sharma',
      phone: '9876543210',
      address: '221B Park Street, Bengaluru, Karnataka'
    },
    items: [
      { productName: 'Canvas Travel Backpack', quantity: 1, selectedColor: 'green', selectedSize: 'large' },
      { productName: 'Bluetooth Speaker', quantity: 1, selectedColor: 'blue', selectedSize: 'portable' }
    ]
  }
];

const buildOrderItems = (orderItems, productMap) => {
  return orderItems.map(item => {
    const product = productMap.get(item.productName);

    if (!product) {
      throw new Error(`Product not found for demo order: ${item.productName}`);
    }

    return {
      product: product._id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize
    };
  });
};

const seedDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in server/.env');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const hashedPassword = await bcrypt.hash(sellerUser.password, 10);

  await User.findOneAndUpdate(
    { email: sellerUser.email },
    {
      username: sellerUser.username,
      email: sellerUser.email,
      password: hashedPassword,
      role: sellerUser.role
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const buyerPassword = await bcrypt.hash('Buyer@12345', 10);
  const buyers = [];

  for (const buyer of buyerUsers) {
    const savedBuyer = await User.findOneAndUpdate(
      { email: buyer.email },
      {
        username: buyer.username,
        email: buyer.email,
        password: buyerPassword,
        role: buyer.role
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    buyers.push(savedBuyer);
  }

  for (const product of products) {
    await Product.findOneAndUpdate(
      { name: product.name },
      product,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  await Order.deleteMany({ user: { $in: buyers.map(buyer => buyer._id) } });

  const savedProducts = await Product.find({ name: { $in: products.map(product => product.name) } });
  const productMap = new Map(savedProducts.map(product => [product.name, product]));
  const buyerMap = new Map(buyers.map(buyer => [buyer.email, buyer]));

  for (const demoOrder of demoOrders) {
    const buyer = buyerMap.get(demoOrder.buyerEmail);
    const items = buildOrderItems(demoOrder.items, productMap);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 2000 ? 0 : 99;
    const inventoryAdjusted = ['Confirmed', 'Packed', 'Shipped', 'Delivered'].includes(demoOrder.status);

    await Order.create({
      user: buyer._id,
      items,
      shippingAddress: demoOrder.shippingAddress,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: demoOrder.status,
      inventoryAdjusted
    });

    if (inventoryAdjusted) {
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }
    }
  }

  console.log(`Seeded seller user: ${sellerUser.email}`);
  console.log(`Seeded ${buyerUsers.length} buyer users`);
  console.log(`Seeded ${products.length} products`);
  console.log(`Seeded ${demoOrders.length} demo orders`);
};

seedDatabase()
  .then(() => mongoose.disconnect())
  .catch((error) => {
    console.error('Seed failed:', error.message);
    mongoose.disconnect();
    process.exit(1);
  });
