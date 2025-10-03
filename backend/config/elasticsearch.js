const { Client } = require('@elastic/elasticsearch');

// Initialize Elasticsearch client
const esClient = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID
  },
  auth: {
    username: process.env.ELASTIC_USERNAME || 'elastic',
    password: process.env.ELASTIC_PASSWORD
  }
});

// Test connection
const testConnection = async () => {
  try {
    const health = await esClient.cluster.health();
    console.log('✅ Elasticsearch connected successfully');
    console.log(`Cluster status: ${health.status}`);
    return true;
  } catch (error) {
    console.error('❌ Elasticsearch connection failed:', error.message);
    return false;
  }
};

// Index name constant
const PRODUCTS_INDEX = 'products';

module.exports = {
  esClient,
  testConnection,
  PRODUCTS_INDEX
};
