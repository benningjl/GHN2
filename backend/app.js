// backend/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db'); // Import the connectDB function

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware for parsing JSON requests
app.use(express.json());

// Enable CORS for all routes (allow all origins)
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

// Import auth routes
const authRoutes = require('./routes/authroutes');
app.use('/api/auth', authRoutes);

// Import user routes
const userRoutes = require('./routes/userroutes');
app.use('/api', userRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
