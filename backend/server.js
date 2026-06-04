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
app.use('/api/posts', require('./src/routes/postRoutes')); 
app.use('/api/products', require('./src/routes/productRoutes')); 
app.use('/api/events', require('./src/routes/eventRoutes')); 
app.use('/api/coaches', require('./src/routes/coachRoutes')); 
app.use('/api/items', require('./src/routes/itemRoutes'));
app.use('/api/dupr', require('./src/routes/duprRoutes'));
app.use('/api/courts', require('./src/routes/courtRoutes'));
app.use('/api/members', require('./src/routes/memberRoutes'));
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/about-images', require('./src/routes/aboutImageRoutes'));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'CNPC API is running smoothly.' });
});

// VERCEL FIX: Only listen locally. Vercel handles its own ports.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

// VERCEL FIX: Export the app so Vercel can run it as a serverless function
module.exports = app;