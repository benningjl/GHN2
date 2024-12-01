const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust the path as needed
const { login } = require('../controllers/authController');

// Secret key (store securely in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

/**
 * Middleware to protect routes by verifying the JWT.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the user data to the request object for downstream handlers
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next(); // Proceed to the next middleware/handler
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

/**
 * Generate a JWT for a user.
 */
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
  protect,
  generateToken,
  login,
};
