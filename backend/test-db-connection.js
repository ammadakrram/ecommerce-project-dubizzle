// test-db-connection.js
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

// Load environment variables
dotenv.config();

console.log('Testing database connection...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden for security)' : 'Not set');

// Create a new Sequelize instance with detailed logging
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log, // Enable SQL query logging
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    
    // Close the connection
    await sequelize.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:');
    console.error(error.message);
    console.error('Error details:', error);
    
    // Check for common connection issues
    if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('Hostname not found. Check if the database server address is correct.');
    } else if (error.message.includes('connect ETIMEDOUT')) {
      console.error('Connection timed out. Check if the database server is running and accessible.');
    } else if (error.message.includes('password authentication failed')) {
      console.error('Authentication failed. Check your username and password.');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error('Database does not exist. Check your database name.');
    }
  }
}

testConnection();
