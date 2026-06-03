require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// API Routes
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/posts', require('./src/routes/postRoutes')); // The Community Hub route
app.use('/api/products', require('./src/routes/productRoutes')); // The Marketplace route
app.use('/api/events', require('./src/routes/eventRoutes')); // The Events calendar route
app.use('/api/coaches', require('./src/routes/coachRoutes')); // The Coach applications route
app.use('/api/items', require('./src/routes/itemRoutes'));
app.use('/api/dupr', require('./src/routes/duprRoutes'));
app.use('/api/courts', require('./src/routes/courtRoutes'));
app.use('/api/members', require('./src/routes/memberRoutes'));
// Add this where your post, event, and item routes are:
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/about-images', require('./src/routes/aboutImageRoutes'));
// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'CNPC API is running smoothly.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});