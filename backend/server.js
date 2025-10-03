const path = require('path');
// temp ^
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

const { connectDB } = require('./config/db'); 
const { errorHandler } = require('./middleware/errorMiddleware');
const { testConnection } = require('./config/elasticsearch');


// Import models to register relationships
require('./models/index');

// Connect to database
connectDB();

// Test Elasticsearch connection (optional, won't crash if it fails)
testConnection().catch(() => {
  console.log('⚠️  Elasticsearch not connected. Search features will be unavailable.');
});

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes')); 

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'API is running...', success: true });
});

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});