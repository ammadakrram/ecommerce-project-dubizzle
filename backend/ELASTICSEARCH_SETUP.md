# Elasticsearch Integration Guide

## 🚀 Quick Start

### Prerequisites
- Elastic Cloud account (free tier available)
- Node.js installed
- PostgreSQL database running

---

## 📋 Phase 1: Elastic Cloud Setup

### Step 1: Create Elastic Cloud Account
1. Go to https://cloud.elastic.co/registration
2. Sign up for a free trial (14 days, no credit card required)
3. Verify your email

### Step 2: Create Deployment
1. After login, click **"Create deployment"**
2. Configure:
   - **Name**: `ecommerce-search`
   - **Cloud provider**: AWS
   - **Region**: Choose closest to your Railway backend
   - **Version**: Latest (8.x)
   - **Deployment size**: Free tier
3. Click **"Create deployment"**

### Step 3: Save Credentials ⚠️ IMPORTANT
After deployment creation, you'll see a screen with credentials. **Copy these immediately** (shown only once):

```
Username: elastic
Password: [your-generated-password]
Cloud ID: [your-cloud-id]
Elasticsearch Endpoint: https://xxxxx.es.region.aws.found.io:9243
```

**Save these in a secure location!**

### Step 4: Update Environment Variables
Open `backend/.env` and update these values:

```env
ELASTIC_CLOUD_ID=your_cloud_id_from_step_3
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=your_password_from_step_3
```

---

## 📦 Phase 2: Index Your Products

### Run the Reindexing Script

This script will:
- Connect to your PostgreSQL database
- Fetch all existing products
- Create the Elasticsearch index with proper mappings
- Bulk index all products into Elasticsearch

```bash
cd backend
node scripts/reindexProducts.js
```

Expected output:
```
🚀 Starting product reindexing...

📊 Connecting to PostgreSQL...
✅ PostgreSQL connected

🔍 Testing Elasticsearch connection...
✅ Elasticsearch connected successfully
Cluster status: green

📝 Creating Elasticsearch index...
✅ Index "products" created successfully

📦 Fetching products from PostgreSQL...
Found 50 products to index

⚡ Indexing products to Elasticsearch...
✅ Bulk indexed 50 products

🎉 Reindexing completed!
```

---

## 🧪 Phase 3: Test the API

### 1. Start Your Server
```bash
npm run dev
```

You should see:
```
✅ Elasticsearch connected successfully
Cluster status: green
Server running in development mode on port 5000
```

### 2. Test Search Endpoints

#### **Basic Search**
```bash
# Search for products
curl "http://localhost:5000/api/search?q=shirt"
```

#### **Search with Filters**
```bash
# Search with category filter
curl "http://localhost:5000/api/search?q=casual&category=T-shirts&minPrice=20&maxPrice=100"
```

#### **Search with Multiple Filters**
```bash
# Search with colors and sizes
curl "http://localhost:5000/api/search?q=hoodie&colors=Black,Blue&sizes=M,L"
```

#### **Search with Sorting**
```bash
# Sort by price (ascending)
curl "http://localhost:5000/api/search?q=jeans&sort=price_asc"

# Sort by price (descending)
curl "http://localhost:5000/api/search?q=jeans&sort=price_desc"

# Sort by rating
curl "http://localhost:5000/api/search?q=shirt&sort=rating"

# Sort by newest
curl "http://localhost:5000/api/search?q=shirt&sort=newest"
```

#### **Autocomplete**
```bash
# Get autocomplete suggestions
curl "http://localhost:5000/api/search/autocomplete?q=sh&limit=5"
```

#### **Get Filter Aggregations**
```bash
# Get available filters/facets
curl "http://localhost:5000/api/search/filters"

# Get filters based on search query
curl "http://localhost:5000/api/search/filters?q=casual"
```

### 3. Response Format

**Search Response:**
```json
{
  "success": true,
  "count": 9,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "id": "uuid-here",
      "name": "Casual T-shirt",
      "description": "Comfortable cotton t-shirt",
      "price": 29.99,
      "category": "T-shirts",
      "rating": 4.5,
      "images": ["url1", "url2"],
      ...
    }
  ]
}
```

**Autocomplete Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Shirt Name",
      "price": 29.99,
      "images": ["url"]
    }
  ]
}
```

**Filters Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      { "value": "T-shirts", "count": 20 },
      { "value": "Jeans", "count": 15 }
    ],
    "colors": [
      { "value": "Black", "count": 30 },
      { "value": "Blue", "count": 25 }
    ],
    "sizes": [
      { "value": "M", "count": 40 },
      { "value": "L", "count": 35 }
    ],
    "priceRange": {
      "min": 19.99,
      "max": 199.99,
      "avg": 59.99
    }
  }
}
```

---

## 🔄 How It Works

### Automatic Sync
Products are automatically synced to Elasticsearch when:

1. **Creating a product** → Indexed to ES
2. **Updating a product** → Updated in ES
3. **Deleting a product** → Removed from ES

### Sync Implementation
The sync happens in the product controller:
- [backend/controllers/productController.js](controllers/productController.js)

If Elasticsearch fails, the operation still succeeds (fail-safe design).

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search` | Search products with filters |
| GET | `/api/search/autocomplete` | Get autocomplete suggestions |
| GET | `/api/search/filters` | Get available filters/aggregations |

### Search Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| q | string | Search query | `shirt` |
| category | string | Filter by category | `T-shirts` |
| minPrice | number | Minimum price | `20` |
| maxPrice | number | Maximum price | `100` |
| colors | string | Comma-separated colors | `Black,Blue` |
| sizes | string | Comma-separated sizes | `M,L,XL` |
| dressStyle | string | Filter by dress style | `Casual` |
| sort | string | Sort order | `price_asc`, `price_desc`, `rating`, `newest`, `relevance` |
| page | number | Page number | `1` |
| limit | number | Results per page | `9` |

---

## 🛠 Maintenance

### Reindex All Products
If you need to reindex all products (after schema changes, etc.):

```bash
node scripts/reindexProducts.js
```

### Check Index Health
You can check your index health in Elastic Cloud dashboard:
1. Go to your deployment
2. Click "Manage"
3. Go to "Index Management"
4. Find the `products` index

---

## 🐛 Troubleshooting

### Connection Failed
```
❌ Elasticsearch connection failed: Unauthorized
```

**Solution:**
- Check your `ELASTIC_CLOUD_ID` and `ELASTIC_PASSWORD` in `.env`
- Make sure credentials are correct

### Index Not Found
```
index_not_found_exception: no such index [products]
```

**Solution:**
- Run the reindexing script: `node scripts/reindexProducts.js`

### No Search Results
**Solution:**
- Make sure products exist in PostgreSQL
- Run reindexing script
- Check if products have `stock > 0` (only in-stock products are searchable)

### Slow Search Performance
**Solution:**
- Elasticsearch free tier has performance limits
- Consider upgrading to a paid tier for production
- Optimize your search queries

---

## 📚 Files Created

```
backend/
├── config/
│   └── elasticsearch.js          # Elasticsearch client config
├── services/
│   └── elasticsearchService.js   # All ES operations
├── controllers/
│   └── searchController.js       # Search API handlers
├── routes/
│   └── searchRoutes.js           # Search routes
└── scripts/
    └── reindexProducts.js        # Bulk indexing script
```

---

## 🚀 Next Steps

1. ✅ Test all search endpoints
2. ✅ Verify autocomplete works
3. ✅ Check filter aggregations
4. 🔜 Build frontend search UI
5. 🔜 Implement search suggestions in frontend
6. 🔜 Add search analytics

---

## 💡 Tips

1. **Always keep PostgreSQL as source of truth** - Elasticsearch is for search only
2. **ES sync is fail-safe** - If ES fails, PostgreSQL operations still succeed
3. **Reindex periodically** - Ensures data consistency
4. **Monitor ES health** - Check Elastic Cloud dashboard regularly
5. **Use autocomplete** - Provides better UX than full search on every keystroke

---

## 🎯 Search Features Implemented

- ✅ Full-text search (name, description)
- ✅ Fuzzy matching (handles typos)
- ✅ Filter by category
- ✅ Filter by price range
- ✅ Filter by colors
- ✅ Filter by sizes
- ✅ Filter by dress style
- ✅ Multiple sort options
- ✅ Pagination
- ✅ Autocomplete suggestions
- ✅ Filter aggregations (facets)
- ✅ Only show in-stock products
- ✅ Automatic index sync

---

## 📞 Need Help?

If you encounter issues:
1. Check server logs for error messages
2. Verify Elasticsearch connection in Elastic Cloud dashboard
3. Test with simple queries first
4. Check `.env` file for correct credentials

Happy searching! 🔍
