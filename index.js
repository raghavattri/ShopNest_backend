const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const configureDns = require('./config/dns');


dotenv.config();
configureDns();


const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(express.json());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error.message));


app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/seller', require('./routes/adminRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes')); 
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'ShopNest API is running' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
