const { esClient, PRODUCTS_INDEX } = require('../config/elasticsearch');

/**
 * Create the products index with proper mappings
 */
const createProductIndex = async () => {
  try {
    const indexExists = await esClient.indices.exists({ index: PRODUCTS_INDEX });

    if (indexExists) {
      console.log(`Index "${PRODUCTS_INDEX}" already exists`);
      return;
    }

    await esClient.indices.create({
      index: PRODUCTS_INDEX,
      body: {
        settings: {
          number_of_shards: 1,
          number_of_replicas: 1,
          analysis: {
            analyzer: {
              autocomplete: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'autocomplete_filter']
              },
              autocomplete_search: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase']
              }
            },
            filter: {
              autocomplete_filter: {
                type: 'edge_ngram',
                min_gram: 2,
                max_gram: 20
              }
            }
          }
        },
        mappings: {
          properties: {
            id: { type: 'keyword' },
            name: {
              type: 'text',
              analyzer: 'autocomplete',
              search_analyzer: 'autocomplete_search',
              fields: {
                keyword: { type: 'keyword' }
              }
            },
            description: {
              type: 'text',
              analyzer: 'standard'
            },
            price: { type: 'float' },
            discountPrice: { type: 'float' },
            discountPercentage: { type: 'integer' },
            images: { type: 'keyword' },
            category: { type: 'keyword' },
            sizes: { type: 'keyword' },
            colors: { type: 'keyword' },
            stock: { type: 'integer' },
            rating: { type: 'float' },
            numReviews: { type: 'integer' },
            dressStyle: { type: 'keyword' },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' }
          }
        }
      }
    });

    console.log(`✅ Index "${PRODUCTS_INDEX}" created successfully`);
  } catch (error) {
    console.error('Error creating index:', error.message);
    throw error;
  }
};

/**
 * Index a single product
 */
const indexProduct = async (product) => {
  try {
    const response = await esClient.index({
      index: PRODUCTS_INDEX,
      id: product.id,
      document: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        discountPrice: product.discountPrice ? parseFloat(product.discountPrice) : null,
        discountPercentage: product.discountPercentage || null,
        images: product.images || [],
        category: product.category,
        sizes: product.sizes || [],
        colors: product.colors || [],
        stock: product.stock,
        rating: parseFloat(product.rating) || 0,
        numReviews: product.numReviews || 0,
        dressStyle: product.dressStyle,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      },
      refresh: true
    });

    console.log(`Product ${product.id} indexed successfully`);
    return response;
  } catch (error) {
    console.error(`Error indexing product ${product.id}:`, error.message);
    throw error;
  }
};

/**
 * Update a product in the index
 */
const updateProduct = async (productId, updates) => {
  try {
    const response = await esClient.update({
      index: PRODUCTS_INDEX,
      id: productId,
      doc: updates,
      refresh: true
    });

    console.log(`Product ${productId} updated successfully`);
    return response;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error.message);
    throw error;
  }
};

/**
 * Delete a product from the index
 */
const deleteProduct = async (productId) => {
  try {
    const response = await esClient.delete({
      index: PRODUCTS_INDEX,
      id: productId,
      refresh: true
    });

    console.log(`Product ${productId} deleted successfully`);
    return response;
  } catch (error) {
    // If product doesn't exist in ES, it's okay
    if (error.meta?.statusCode === 404) {
      console.log(`Product ${productId} not found in Elasticsearch (already deleted)`);
      return;
    }
    console.error(`Error deleting product ${productId}:`, error.message);
    throw error;
  }
};

/**
 * Bulk index products
 */
const bulkIndexProducts = async (products) => {
  try {
    const operations = products.flatMap(product => [
      { index: { _index: PRODUCTS_INDEX, _id: product.id } },
      {
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        discountPrice: product.discountPrice ? parseFloat(product.discountPrice) : null,
        discountPercentage: product.discountPercentage || null,
        images: product.images || [],
        category: product.category,
        sizes: product.sizes || [],
        colors: product.colors || [],
        stock: product.stock,
        rating: parseFloat(product.rating) || 0,
        numReviews: product.numReviews || 0,
        dressStyle: product.dressStyle,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    ]);

    const response = await esClient.bulk({
      operations,
      refresh: true
    });

    if (response.errors) {
      const erroredDocuments = [];
      response.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
            operation: operations[i * 2],
            document: operations[i * 2 + 1]
          });
        }
      });
      console.error('Bulk indexing errors:', erroredDocuments);
    }

    console.log(`✅ Bulk indexed ${products.length} products`);
    return response;
  } catch (error) {
    console.error('Error bulk indexing products:', error.message);
    throw error;
  }
};

/**
 * Search products
 */
const searchProducts = async (searchParams) => {
  const {
    query = '',
    category,
    minPrice,
    maxPrice,
    colors,
    sizes,
    dressStyle,
    sort = 'relevance',
    page = 1,
    limit = 9
  } = searchParams;

  const from = (page - 1) * limit;

  // Build the query
  const must = [];
  const filter = [];

  // Text search
  if (query && query.trim() !== '') {
    must.push({
      multi_match: {
        query: query,
        fields: ['name^3', 'description'],
        type: 'best_fields',
        fuzziness: 'AUTO'
      }
    });
  } else {
    must.push({ match_all: {} });
  }

  // Filters
  if (category) {
    filter.push({ term: { category } });
  }

  if (dressStyle) {
    filter.push({ term: { dressStyle } });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceRange = {};
    if (minPrice !== undefined) priceRange.gte = parseFloat(minPrice);
    if (maxPrice !== undefined) priceRange.lte = parseFloat(maxPrice);
    filter.push({ range: { price: priceRange } });
  }

  if (colors && colors.length > 0) {
    const colorArray = Array.isArray(colors) ? colors : colors.split(',');
    filter.push({ terms: { colors: colorArray } });
  }

  if (sizes && sizes.length > 0) {
    const sizeArray = Array.isArray(sizes) ? sizes : sizes.split(',');
    filter.push({ terms: { sizes: sizeArray } });
  }

  // Only show in-stock products
  filter.push({ range: { stock: { gt: 0 } } });

  // Sorting
  let sortOptions = [];
  switch (sort) {
    case 'price_asc':
      sortOptions = [{ price: { order: 'asc' } }];
      break;
    case 'price_desc':
      sortOptions = [{ price: { order: 'desc' } }];
      break;
    case 'rating':
      sortOptions = [{ rating: { order: 'desc' } }];
      break;
    case 'newest':
      sortOptions = [{ createdAt: { order: 'desc' } }];
      break;
    case 'relevance':
    default:
      sortOptions = query ? ['_score'] : [{ createdAt: { order: 'desc' } }];
      break;
  }

  try {
    const response = await esClient.search({
      index: PRODUCTS_INDEX,
      body: {
        query: {
          bool: {
            must,
            filter
          }
        },
        sort: sortOptions,
        from,
        size: limit,
        track_total_hits: true
      }
    });

    const hits = response.hits.hits.map(hit => ({
      ...hit._source,
      _score: hit._score
    }));

    const total = response.hits.total.value;

    return {
      products: hits,
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    };
  } catch (error) {
    console.error('Error searching products:', error.message);
    throw error;
  }
};

/**
 * Get autocomplete suggestions
 */
const getAutocompleteSuggestions = async (query, limit = 5) => {
  try {
    const response = await esClient.search({
      index: PRODUCTS_INDEX,
      body: {
        _source: ['name', 'id', 'price', 'images'],
        size: limit,
        query: {
          bool: {
            must: [
              {
                match: {
                  name: {
                    query: query,
                    fuzziness: 'AUTO'
                  }
                }
              }
            ],
            filter: [
              { range: { stock: { gt: 0 } } }
            ]
          }
        }
      }
    });

    const suggestions = response.hits.hits.map(hit => hit._source);

    return suggestions;
  } catch (error) {
    console.error('Error getting autocomplete suggestions:', error.message);
    throw error;
  }
};

/**
 * Get aggregations (for filters)
 */
const getAggregations = async (query = '') => {
  try {
    const must = query && query.trim() !== ''
      ? [{
          multi_match: {
            query: query,
            fields: ['name^3', 'description'],
            fuzziness: 'AUTO'
          }
        }]
      : [{ match_all: {} }];

    const response = await esClient.search({
      index: PRODUCTS_INDEX,
      body: {
        query: {
          bool: {
            must,
            filter: [{ range: { stock: { gt: 0 } } }]
          }
        },
        size: 0,
        aggs: {
          categories: {
            terms: {
              field: 'category',
              size: 10
            }
          },
          colors: {
            terms: {
              field: 'colors',
              size: 20
            }
          },
          sizes: {
            terms: {
              field: 'sizes',
              size: 10
            }
          },
          dressStyles: {
            terms: {
              field: 'dressStyle',
              size: 10
            }
          },
          priceStats: {
            stats: {
              field: 'price'
            }
          }
        }
      }
    });

    return {
      categories: response.aggregations.categories.buckets.map(b => ({
        value: b.key,
        count: b.doc_count
      })),
      colors: response.aggregations.colors.buckets.map(b => ({
        value: b.key,
        count: b.doc_count
      })),
      sizes: response.aggregations.sizes.buckets.map(b => ({
        value: b.key,
        count: b.doc_count
      })),
      dressStyles: response.aggregations.dressStyles.buckets.map(b => ({
        value: b.key,
        count: b.doc_count
      })),
      priceRange: {
        min: response.aggregations.priceStats.min,
        max: response.aggregations.priceStats.max,
        avg: response.aggregations.priceStats.avg
      }
    };
  } catch (error) {
    console.error('Error getting aggregations:', error.message);
    throw error;
  }
};

module.exports = {
  createProductIndex,
  indexProduct,
  updateProduct,
  deleteProduct,
  bulkIndexProducts,
  searchProducts,
  getAutocompleteSuggestions,
  getAggregations
};
