const path = require('path');
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
  console.log('⚠️ Elasticsearch not connected. Search features will be unavailable.');
});

const app = express();

// ============= UPDATED CORS CONFIGURATION =============
const allowedOrigins = [
  'http://localhost:5173',           // Local Vite dev
  'http://localhost:3000',           // Local CRA dev
  process.env.CLIENT_URL,            // Main production URL from env
  process.env.VERCEL_URL,            // Vercel deployment URL from env
  'https://unwakened-marquis-evaporable.ngrok-free.dev',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Allow all Vercel preview deployments (*.vercel.app)
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // Allow your custom domain if you have one
    if (process.env.CUSTOM_DOMAIN && origin.endsWith(process.env.CUSTOM_DOMAIN)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
// ======================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Health check with more info
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running...', 
    success: true,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API health endpoint (useful for monitoring)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

module.exports = app; // For testing purposes