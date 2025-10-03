const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('../config/db');
const { Product } = require('../models');
const { testConnection } = require('../config/elasticsearch');
const {
  createProductIndex,
  bulkIndexProducts
} = require('../services/elasticsearchService');

/**
 * Script to reindex all products from PostgreSQL to Elasticsearch
 */
const reindexAllProducts = async () => {
  try {
    console.log('🚀 Starting product reindexing...\n');

    // Connect to PostgreSQL
    console.log('📊 Connecting to PostgreSQL...');
    await connectDB();

    // Test Elasticsearch connection
    console.log('🔍 Testing Elasticsearch connection...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Failed to connect to Elasticsearch');
    }

    // Create index with mappings
    console.log('\n📝 Creating Elasticsearch index...');
    await createProductIndex();

    // Fetch all products from PostgreSQL
    console.log('\n📦 Fetching products from PostgreSQL...');
    const products = await Product.findAll({
      raw: true
    });

    if (products.length === 0) {
      console.log('⚠️  No products found in database');
      process.exit(0);
    }

    console.log(`Found ${products.length} products to index\n`);

    // Bulk index products to Elasticsearch
    console.log('⚡ Indexing products to Elasticsearch...');
    await bulkIndexProducts(products);

    console.log(`\n✅ Successfully indexed ${products.length} products`);
    console.log('\n🎉 Reindexing completed!');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during reindexing:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run the script
reindexAllProducts();
