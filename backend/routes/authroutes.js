const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { login } = require('../controllers/authController'); // Ensure path is correct
const { resetPassword } = require('../controllers/passwordController'); // Import resetPassword function
const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'yourSecretKey', { expiresIn: '1h' });
};

// Register a new user
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array()); // Log validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if the user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        console.log('User already exists:', email); // Log existing user
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      // Generate a token
      const token = generateToken(user._id);

      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login a user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// Reset password route
router.post('/reset-password', resetPassword);

module.exports = router;