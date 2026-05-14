const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

const sellerMiddleware = (req, res, next) => {
  if (req.user && ['admin', 'seller'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
};

module.exports = { authMiddleware, sellerMiddleware, adminMiddleware: sellerMiddleware };
