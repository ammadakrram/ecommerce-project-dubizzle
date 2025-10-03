# Elasticsearch Quick Reference

## 🚀 Getting Started (5 minutes)

### 1. Create Elastic Cloud Account
```
→ https://cloud.elastic.co/registration
→ Sign up (free, no credit card)
→ Create deployment (AWS, free tier)
→ SAVE credentials (Cloud ID + Password)
```

### 2. Configure Environment
```bash
# Edit backend/.env
ELASTIC_CLOUD_ID=your_cloud_id_here
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=your_password_here
```

### 3. Index Your Products
```bash
cd backend
npm run reindex
```

### 4. Start Server
```bash
npm run dev
```

---

## 📡 API Endpoints

### Search Products
```bash
GET /api/search?q=shirt&category=T-shirts&minPrice=20&maxPrice=100&sort=price_asc&page=1&limit=9
```

### Autocomplete
```bash
GET /api/search/autocomplete?q=sh&limit=5
```

### Get Filters
```bash
GET /api/search/filters?q=casual
```

---

## 🔧 Query Parameters

| Parameter | Example | Description |
|-----------|---------|-------------|
| `q` | `shirt` | Search term |
| `category` | `T-shirts` | Filter category |
| `minPrice` | `20` | Min price |
| `maxPrice` | `100` | Max price |
| `colors` | `Black,Blue` | Colors (comma-separated) |
| `sizes` | `M,L` | Sizes (comma-separated) |
| `dressStyle` | `Casual` | Dress style |
| `sort` | `price_asc` | Sort order |
| `page` | `1` | Page number |
| `limit` | `9` | Results per page |

### Sort Options
- `relevance` (default) - Best match first
- `price_asc` - Price low to high
- `price_desc` - Price high to low
- `rating` - Highest rated first
- `newest` - Newest first

---

## 🛠 Common Commands

```bash
# Reindex all products
npm run reindex

# Start development server
npm run dev

# Start production server
npm start
```

---

## 📁 File Structure

```
backend/
├── config/elasticsearch.js           # ES client setup
├── services/elasticsearchService.js  # ES operations
├── controllers/searchController.js   # API handlers
├── routes/searchRoutes.js           # Routes
└── scripts/reindexProducts.js       # Bulk indexing
```

---

## ✅ Test Checklist

- [ ] Elastic Cloud deployment created
- [ ] Environment variables configured
- [ ] Products indexed successfully
- [ ] Server starts without errors
- [ ] Search endpoint works
- [ ] Autocomplete works
- [ ] Filters work
- [ ] Sorting works
- [ ] Pagination works

---

## 🐛 Quick Fixes

### Connection Error
```bash
# Check .env file
ELASTIC_CLOUD_ID=...
ELASTIC_PASSWORD=...
```

### No Results
```bash
# Reindex products
npm run reindex
```

### Server Won't Start
```bash
# Check Elasticsearch connection
# Server will start even if ES is down
# Search features just won't work
```

---

## 📊 What Elasticsearch Does

✅ **Search** - Fast full-text search across products
✅ **Autocomplete** - Suggestions as user types
✅ **Filters** - Category, price, color, size filters
✅ **Sorting** - By price, rating, date, relevance
✅ **Facets** - Show available filter options with counts

❌ **NOT** - Primary database (PostgreSQL is source of truth)

---

## 🎯 Frontend Integration (Coming Next)

You'll use these endpoints in your React frontend:

```javascript
// Search products
fetch('/api/search?q=shirt&category=T-shirts')

// Autocomplete
fetch('/api/search/autocomplete?q=sh')

// Get filters
fetch('/api/search/filters')
```

---

## 💡 Pro Tips

1. **Test with Postman/Thunder Client first**
2. **Keep PostgreSQL as source of truth**
3. **ES sync is automatic** - no manual intervention needed
4. **Reindex after bulk data changes**
5. **Monitor ES health in Elastic Cloud dashboard**

---

## 📞 Need Help?

See detailed guide: [ELASTICSEARCH_SETUP.md](ELASTICSEARCH_SETUP.md)
